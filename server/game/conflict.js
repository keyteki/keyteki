const _ = require('underscore');
const GameObject = require('./GameObject');
const Player = require('./player.js');
const Settings = require('../settings.js');

class Conflict extends GameObject {
    constructor(game, attackingPlayer, defendingPlayer, ring = null, conflictProvince = null) {
        super(game, 'Conflict');
        this.attackingPlayer = attackingPlayer;
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.declaredRing = this.ring = ring;
        this.declaredType = null;
        this.conflictProvince = conflictProvince;
        this.conflictPassed = false;
        this.conflictTypeSwitched = false;
        this.conflictUnopposed = false;
        this.winnerGoesStraightToNextConflict = false;
        this.attackers = [];
        this.attackerSkill = 0;
        this.defenders = [];
        this.defenderSkill = 0;
    }

    get conflictType() {
        return this.ring ? this.ring.conflictType : '';
    }

    get element() {
        return this.ring ? this.ring.element : '';
    }

    get maxAllowedDefenders() {
        let effects = this.getEffects('restrictNumberOfDefenders');
        return effects.length === 0 ? -1 : Math.min(...effects);
    }
        
    singlePlayerDefender() {
        let dummyPlayer = new Player('', Settings.getUserWithDefaultsSet({ username: 'Dummy Player' }), false, this.game);
        dummyPlayer.initialise();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForConflict();
        this.defendingPlayer.resetForConflict();
        if(this.ring) {
            this.ring.resetRing();
            this.ring = null;
        }
        if(this.conflictProvince) {
            this.conflictProvince.inConflict = false;
        }
    }

    addAttackers(attackers) {
        attackers = _.reject(attackers, card => this.isAttacking(card));
        if(attackers.length > 0) {
            this.attackers = this.attackers.concat(attackers);
            this.markAsParticipating(attackers);
        }
    }

    addAttacker(attacker) {
        if(this.attackers.includes(attacker)) {
            return;
        }
        this.attackers.push(attacker);
        this.markAsParticipating([attacker]);
    }

    addDefenders(defenders) {
        defenders = _.reject(defenders, card => this.isDefending(card));
        if(defenders.length > 0) {
            this.defenders = this.defenders.concat(defenders);
            this.markAsParticipating(defenders);
        }
    }

    addDefender(defender) {
        if(this.defenders.includes(defender)) {
            return;
        }
        this.defenders.push(defender);
        this.markAsParticipating([defender]);
    }
            
    
    hasElement(element) {
        return this.elements.includes(element);
    }
    
    get elements() {
        return this.ring ? this.ring.getElements() : [];
    }

    get elementsToResolve() {
        return this.sumEffects('modifyConflictElementsToResolve') + 1;
    }
    
    switchType() {
        this.ring.flipConflictType();
        this.conflictTypeSwitched = true;
    }
    
    switchElement(element) {
        let newRing = this.game.rings[element];
        if(!newRing) {
            throw new Error('switchElement called for non-existant element');
        }
        if(this.attackingPlayer.allowGameAction('takeFateFromRings') && newRing.fate > 0) {
            this.game.addMessage('{0} takes {1} fate from {2}', this.attackingPlayer, newRing.fate, newRing);
            this.attackingPlayer.modifyFate(newRing.fate);
            newRing.fate = 0;
        }
        if(newRing.conflictType !== this.conflictType) {
            newRing.flipConflictType();
        }
        this.ring.resetRing();
        newRing.contested = true;
        this.ring = newRing;
    }
    
    checkForIllegalParticipants() {
        let illegal = this.attackers.filter(card => !card.canParticipateAsAttacker(this.conflictType));
        illegal = illegal.concat(this.defenders.filter(card => !card.canParticipateAsDefender(this.conflictType)));
        if(illegal.length > 0) {
            this.game.addMessage('{0} cannot participate in the conflict any more and {1} sent home bowed', illegal, illegal.length > 1 ? 'are' : 'is');
            this.game.applyGameAction(null, { sendHome: illegal, bow: illegal });
        }
    }

    removeFromConflict(card) {
        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);

        card.inConflict = false;
    }

    markAsParticipating(cards) {
        _.each(cards, card => {
            card.inConflict = true;
        });
    }

    isAttacking(card) {
        return this.attackers.includes(card);
    }

    isDefending(card) {
        return this.defenders.includes(card);
    }

    isParticipating(card) {
        return this.isAttacking(card) || this.isDefending(card);
    }

    anyParticipants(predicate) {
        return this.attackers.concat(this.defenders).some(predicate);
    }

    getNumberOfParticipants(predicate) {
        let participants = this.attackers.concat(this.defenders);
        return _.reduce(participants, (count, card) => {
            if(predicate(card)) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    hasMoreParticipants(player, predicate = () => true) {
        if(!player.opponent) {
            return this.anyParticipants(predicate);
        }
        let playerTotal = this.getCharacters(player).filter(predicate).length + player.sumEffects('additionalCharactersInConflict');
        let opponentTotal = this.getCharacters(player.opponent).filter(predicate).length + player.opponent.sumEffects('additionalCharactersInConflict');
        return playerTotal > opponentTotal;
    }

    calculateSkill(stateChanged = false) {
        stateChanged = this.game.effectEngine.checkEffects(stateChanged);

        if(this.winnerDetermined) {
            return stateChanged;
        }

        let additionalCharacters = this.getEffects('contribute');
        let additionalAttackers = additionalCharacters.filter(card => card.controller === this.attackingPlayer);
        let additionalDefenders = additionalCharacters.filter(card => card.controller === this.defendingPlayer);
        this.attackerSkill = this.calculateSkillFor(this.attackers.concat(additionalAttackers));
        this.defenderSkill = this.calculateSkillFor(this.defenders.concat(additionalDefenders));
        
        if(this.attackingPlayer.imperialFavor === this.conflictType && this.attackers.length > 0) {
            this.attackerSkill++;
        } else if(this.defendingPlayer.imperialFavor === this.conflictType && this.defenders.length > 0) {
            this.defenderSkill++;
        }
        return stateChanged;
    }

    calculateSkillFor(cards) {
        let skillFunction = this.mostRecentEffect('skillFunction') || (card => card.getSkill(this.conflictType));
        return cards.reduce((sum, card) => {
            if(card.bowed || !card.allowGameAction('countForResolution')) {
                return sum;
            }
            return sum + skillFunction(card);
        }, 0);
    }

    determineWinner() {
        this.calculateSkill();
        this.winnerDetermined = true;

        if(this.attackerSkill === 0 && this.defenderSkill === 0) {
            this.loser = undefined;
            this.winner = undefined;
            this.loserSkill = this.winnerSkill = 0;
            this.skillDifference = 0;
            return;
        }
        if(this.attackerSkill >= this.defenderSkill) {
            this.loser = this.defendingPlayer;
            this.loserSkill = this.defenderSkill;
            this.winner = this.attackingPlayer;
            this.winnerSkill = this.attackerSkill;
        } else {
            this.loser = this.attackingPlayer;
            this.loserSkill = this.attackerSkill;
            this.winner = this.defendingPlayer;
            this.winnerSkill = this.defenderSkill;
        }

        this.skillDifference = this.winnerSkill - this.loserSkill;
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    getCharacters(player) {
        if(!player) {
            return [];
        }
        return this.attackingPlayer === player ? this.attackers : this.defenders;
    }

    passConflict(message = '{0} has chosen to pass their conflict opportunity') {
        this.game.addMessage(message, this.attackingPlayer);
        this.conflictPassed = true;
        this.game.conflictCompleted(this);
        this.game.raiseEvent('onConflictPass', { conflict: this });
        this.resetCards();
    }
}

module.exports = Conflict;
