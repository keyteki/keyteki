const _ = require('underscore');
const Player = require('./player.js');
const Settings = require('../settings.js');

class Conflict {
    constructor(game, attackingPlayer, defendingPlayer, conflictType = '', conflictRing = '', conflictProvince = null) {
        this.game = game;
        this.attackingPlayer = attackingPlayer;
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.conflictDeclaredRing = conflictRing;
        this.conflictPassed = false;
        this.conflictType = conflictType;
        this.conflictRing = conflictRing;
        this.conflictProvince = conflictProvince;
        this.conflictTypeSwitched = false;
        this.conflictUnopposed = false;
        this.winnerGoesStraightToNextConflict = false;
        this.elementsToResolve = 1;
        this.elements = [];
        this.attackers = [];
        this.attackerSkill = 0;
        this.attackerSkillModifier = 0;
        this.defenders = [];
        this.defenderSkill = 0;
        this.maxAllowedDefenders = 0;
        this.defenderSkillModifier = 0;
    }

    singlePlayerDefender() {
        let dummyPlayer = new Player('', Settings.getUserWithDefaultsSet({ name: 'Dummy Player' }), false, this.game);
        dummyPlayer.initialise();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForConflict();
        this.defendingPlayer.resetForConflict();
        if(this.conflictProvince) {
            this.conflictProvince.inConflict = false;
        }
    }

    initiateConflict() {
        this.attackingPlayer.initiateConflict(this.conflictType);
    }

    addAttackers(attackers) {
        this.attackers = this.attackers.concat(attackers);
        this.markAsParticipating(attackers);
        this.calculateSkill();
    }

    addAttacker(attacker) {
        this.attackers.push(attacker);
        this.markAsParticipating([attacker]);
        this.calculateSkill();
    }

    addDefenders(defenders) {
        this.defenders = this.defenders.concat(defenders);
        this.markAsParticipating(defenders);
        this.calculateSkill();
    }

    addDefender(defender) {
        this.defenders.push(defender);
        this.markAsParticipating([defender]);
        this.calculateSkill();
    }
    
    moveToConflict(cards) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }
        let events = _.map(cards, card => {
            return {
                name: 'onMoveToConflict',
                params: { conflict: this, card: card },
                handler: card.controller.isAttackingPlayer() ? () => this.addAttacker(card) : () => this.addDefender(card)
            };
        });
        this.game.raiseMultipleEvents(events, {
            name: 'onMoveCharactersToConflict',
            params: { conflict: this, cards: cards },
        });
    }

    sendHome(cards) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }
        let events = _.map(cards, card => {
            return {
                name: 'onSendHome',
                params: { conflict: this, card: card },
                handler: () => this.removeFromConflict(card)
            };
        });
        this.game.raiseMultipleEvents(events, {
            name: 'onSendCharactersHome',
            params: { conflict: this, cards: cards }
        });
    }

    modifyElementsToResolve(amount) {
        this.elementsToResolve += amount;
    }
        
    
    hasElement(element) {
        return this.elements.includes(element);
    }
    
    getElements() {
        return _.uniq(this.elements);
    }
    
    addElement(element) {
        this.elements.push(element);
    }
    
    removeElement(element) {
        let index = _.indexOf(this.elements, element);
        if(index > -1) {
            this.elements.splice(index, 1);
        }
    }
    
    chooseWhetherToResolveRingEffect(player = this.attackingPlayer) {
        this.game.raiseEvent('onResolveRingEffect', { player: player, conflict: this }, () => {
            let elements = this.getElements();
            if(elements.length === 1) {
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'Do you want to resolve the ' + elements[0] + ' ring?',
                    waitingPromptTitle: 'Waiting for opponent to use decide whether to resolve the conflict ring',
                    source: 'Resolve Ring Effects',
                    choices: ['Yes', 'No'],
                    handlers: [() => this.resolveConflictRing(player), () => this.game.addMessage('{0} chooses not to resolve the {1} ring', player, elements[0])]
                });
            } else {
                this.resolveConflictRing(player);
            }        
        });
    }
    
    resolveConflictRing(player = this.attackingPlayer, optional = true) {
        let elements = this.getElements();
        if(elements.length === 0) {
            return;
        }
        if(elements.length === 1) {
            player.resolveRingEffects(elements, optional);
            return;
        }
        if(this.elementsToResolve >= elements.length) {
            if(optional) {
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'Do you want to resolve all the elements of the conflict ring?',
                    waitingPromptTitle: 'Waiting for opponent to use decide whether to resolve the conflict ring',
                    source: 'Resolve Ring Effects',
                    choices: ['Resolve All Elements', 'Choose Elements to Resolve'],
                    handlers: [() => player.resolveRingEffects(elements, optional), () => this.chooseElementsToResolve(player, optional, this.elementsToResolve, elements)]
                });
                return;
            }
            player.resolveRingEffects(elements, optional);
            return;
        }
        this.chooseElementsToResolve(player, optional, this.elementsToResolve, elements);
    }
        
    chooseElementsToResolve(player, optional, elementsToResolve, elements, chosenElements = []) {
        if(elements.length === 0 || elementsToResolve === 0) {
            player.resolveRingEffects(chosenElements, optional);
            return;
        }
        let activePromptTitle = 'Choose a ring effect to resolve';
        if(chosenElements.length > 0) {
            activePromptTitle = _.reduce(chosenElements, (string, element) => string + ' ' + element, activePromptTitle + '\nChosen elements:');
        }
        this.game.promptForRingSelect(player, {
            activePromptTitle: activePromptTitle,
            ringCondition: ring => elements.includes(ring.element),
            onSelect: (player, ring) => {
                elementsToResolve--;
                chosenElements.push(ring.element);
                this.chooseElementsToResolve(player, optional, elementsToResolve, _.without(elements, ring.element), chosenElements);
                return true;
            },
            onCancel: () => player.resolveRingEffects(chosenElements, optional)
        });
    }
    
    switchType() {
        let ring = this.game.rings[this.conflictRing];
        ring.flipConflictType();
        this.conflictType = ring.conflictType;
        this.conflictTypeSwitched = true;
        this.game.reapplyStateDependentEffects();
        this.checkForIllegalParticipants();
    }
    
    switchElement(element) {
        let oldRing = this.game.rings[this.conflictRing];
        oldRing.contested = false;
        this.elements = _.reject(this.elements, element => element === oldRing.element);
        this.conflictRing = element;
        let newRing = this.game.rings[element];
        this.game.addFate(this.attackingPlayer, newRing.fate);
        newRing.fate = 0;
        newRing.contested = true;
        if(newRing.conflictType !== this.conflictType) {
            newRing.flipConflictType();
        }
        this.elements.push(element);
    }
    
    checkForIllegalParticipants() {
        _.each(this.attackers, card => {
            if(!card.canParticipateAsAttacker(this.conflictType)) {
                this.removeFromConflict(card);
                card.bowed = true;
            }
        });
        _.each(this.defenders, card => {
            if(!card.canParticipateAsDefender(this.conflictType)) {
                this.removeFromConflict(card);
                card.bowed = true;
            }
        });
    }

    removeFromConflict(card) {
        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);

        card.inConflict = false;

        this.calculateSkill();
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
        let participants = this.attackers.concat(this.defenders);
        return _.any(participants, predicate);
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

    calculateSkill() {
        if(this.winnerDetermined) {
            return;
        }

        this.attackerSkill = this.calculateSkillFor(this.attackers) + this.attackerSkillModifier;
        this.defenderSkill = this.calculateSkillFor(this.defenders) + this.defenderSkillModifier;
        
        if(this.attackingPlayer.imperialFavor === this.conflictType && this.attackers.length > 0) {
            this.attackerSkill++;
        } else if(this.defendingPlayer.imperialFavor === this.conflictType && this.defenders.length > 0) {
            this.defenderSkill++;
        }
    }

    calculateSkillFor(cards) {
        return _.reduce(cards, (sum, card) => {
            if(card.bowed || !card.allowGameAction('countForResolution')) {
                return sum;
            }
            return sum + card.getSkill(this.conflictType);
        }, 0);
    }

    modifyAttackerSkill(value) {
        this.attackerSkillModifier += value;
        this.calculateSkill();
    }

    modifyDefenderSkill(value) {
        this.defenderSkillModifier += value;
        this.calculateSkill();
    }

    determineWinner() {
        this.winnerDetermined = true;

        this.calculateSkill();

        let result = this.checkNoWinnerOrLoser();
        if(result.noWinner) {
            this.noWinnerMessage = result.message;
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

        this.winner.winConflict(this.conflictType, this.attackingPlayer === this.winner);
        this.loser.loseConflict(this.conflictType, this.attackingPlayer === this.loser);
        this.skillDifference = this.winnerSkill - this.loserSkill;
    }

    checkNoWinnerOrLoser() {
        const noWinnerRules = [
            {
                condition: () => this.attackerSkill === 0 && this.defenderSkill === 0,
                message: 'There is no winner or loser for this conflict because the attacker skill is 0'
            },
            {
                condition: () => this.attackerSkill >= this.defenderSkill && this.attackingPlayer.cannotWinConflict,
                message: 'There is no winner or loser for this conflict because the attacker cannot win'
            },
            {
                condition: () => this.attackerSkill >= this.defenderSkill && this.attackers.length === 0,
                message: 'There is no winner or loser for this conflict because the attacker has no participants'
            },
            {
                condition: () => this.defenderSkill > this.attackerSkill && this.defendingPlayer.cannotWinConflict,
                message: 'There is no winner or loser for this conflict because the defender cannot win'
            },
            {
                condition: () => this.defenderSkill > this.attackerSkill && this.defenders.length === 0,
                message: 'There is no winner or loser for this conflict because the defender has no participants'
            }
        ];

        return _.chain(noWinnerRules)
            .map(rule => ({ noWinner: !!rule.condition(), message: rule.message }))
            .find(match => match.noWinner)
            .value() || { noWinner: false };
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    isUnopposed() {
        return this.loserSkill <= 0 && this.winnerSkill > 0;
    }

    getWinnerCards() {
        if(this.winner === this.attackingPlayer) {
            return this.attackers;
        } else if(this.winner === this.defendingPlayer) {
            return this.defenders;
        }

        return [];
    }

    getOpponentCards(player) {
        return this.attackingPlayer === player ? this.defenders : this.attackers;
    }


    finish() {
        _.each(this.attackers, card => card.inConflict = false);
        _.each(this.defenders, card => card.inConflict = false);
    }

    cancelConflict() {
        this.cancelled = true;

        this.resetCards();

        this.game.addMessage('{0} has chosen to pass their conflict opportunity', this.attackingPlayer);
    }
}

module.exports = Conflict;
