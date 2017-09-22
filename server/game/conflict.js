const _ = require('underscore');
const Player = require('./player.js');
const EventRegistrar = require('./eventregistrar.js');

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
        this.attackers = [];
        this.attackerSkill = 0;
        this.attackerSkillModifier = 0;
        this.defenders = [];
        this.defenderSkill = 0;
        this.defenderSkillModifier = 0;
        this.provinceRevealedDuringConflict = false;
        this.events = new EventRegistrar(game, this);
        this.registerEvents(['onCardLeftPlay']);
    }

    singlePlayerDefender() {
        var dummyPlayer = new Player('', { name: 'Dummy Player' }, false, this.game);
        dummyPlayer.initialise();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForConflict();
        this.defendingPlayer.resetForConflict();
    }

    initiateConflict() {
        this.attackingPlayer.initiateConflict(this.conflictType);
    }

    addAttackers(attackers) {
        this.attackers = this.attackers.concat(attackers);
        this.markAsParticipating(attackers, 'attacker');
        this.calculateSkill();
    }

    addAttacker(attacker) {
        this.attackers.push(attacker);
        this.markAsParticipating([attacker], 'attacker');
        this.calculateSkill();
    }

    addDefenders(defenders) {
        this.defenders = this.defenders.concat(defenders);
        this.markAsParticipating(defenders, 'defender');
        this.calculateSkill();
    }

    addDefender(defender) {
        this.defenders.push(defender);
        this.markAsParticipating([defender], 'defender');
        this.calculateSkill();
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
        
        if(this.attackingPlayer.imperialFavor === this.conflictType && this.attackers !== []) {
            this.attackerSkill++;
        } else if(this.defendingPlayer.imperialFavor === this.conflictType && this.defenders !== []) {
            this.defenderSkill++;
        }
    }

    calculateSkillFor(cards) {
        return _.reduce(cards, (sum, card) => {
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

    onCardLeftPlay(event) {
        if(!this.winnerDetermined) {
            this.removeFromConflict(event.card);
        }
    }

    registerEvents(events) {
        this.events.register(events);
    }

    unregisterEvents() {
        this.events.unregisterAll();
    }

    finish() {
        _.each(this.attackers, card => card.inConflict = false);
        _.each(this.defenders, card => card.inConflict = false);
    }

    cancelConflict() {
        this.cancelled = true;

        this.resetCards();
        if(this.conflictProvince) {
            this.conflictProvince.inConflict = false;
        }

        this.game.addMessage('{0}\'s {1} conflict is cancelled', this.attackingPlayer, this.conflictType);
    }
}

module.exports = Conflict;
