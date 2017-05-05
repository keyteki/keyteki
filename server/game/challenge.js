const _ = require('underscore');
const Player = require('./player.js');
const EventRegistrar = require('./eventregistrar.js');

class Challenge {
    constructor(game, attackingPlayer, defendingPlayer, challengeType) {
        this.game = game;
        this.attackingPlayer = attackingPlayer;
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.challengeType = challengeType;
        this.attackers = [];
        this.attackerStrength = 0;
        this.attackerStrengthModifier = 0;
        this.defenders = [];
        this.defenderStrength = 0;
        this.defenderStrengthModifier = 0;
        this.events = new EventRegistrar(game, this);
        this.registerEvents(['onCardLeftPlay']);
    }

    singlePlayerDefender() {
        var dummyPlayer = new Player('', { name: 'Dummy Player' }, false, this.game);
        dummyPlayer.initialise();
        dummyPlayer.startPlotPhase();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForChallenge();
        this.defendingPlayer.resetForChallenge();
    }

    initiateChallenge() {
        this.attackingPlayer.initiateChallenge(this.challengeType);
    }

    addAttackers(attackers) {
        this.attackers = this.attackers.concat(attackers);
        this.markAsParticipating(attackers, 'attacker');
        this.calculateStrength();
    }

    addAttacker(attacker) {
        this.attackers.push(attacker);
        this.markAsParticipating([attacker], 'attacker');
        this.calculateStrength();
    }

    addDefenders(defenders) {
        this.defenders = this.defenders.concat(defenders);
        this.markAsParticipating(defenders, 'defender');
        this.calculateStrength();
    }

    addDefender(defender) {
        this.defenders.push(defender);
        this.markAsParticipating([defender], 'defender');
        this.calculateStrength();
    }

    removeFromChallenge(card) {
        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);

        card.inChallenge = false;

        this.calculateStrength();
    }

    markAsParticipating(cards, participantType) {
        _.each(cards, card => {
            if(!card.kneeled && !card.challengeOptions.doesNotKneelAs[participantType]) {
                card.controller.kneelCard(card);
            }

            card.inChallenge = true;
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

    getNumberOfParticipants(predicate) {
        let participants = this.attackers.concat(this.defenders);
        return _.reduce(participants, (count, card) => {
            if(predicate(card)) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    calculateStrength() {
        this.attackerStrength = this.calculateStrengthFor(this.attackers) + this.attackerStrengthModifier;
        this.defenderStrength = this.calculateStrengthFor(this.defenders) + this.defenderStrengthModifier;
    }

    calculateStrengthFor(cards) {
        return _.reduce(cards, (sum, card) => {
            return sum + card.getStrength();
        }, 0);
    }

    modifyAttackerStrength(value) {
        this.attackerStrengthModifier += value;
        this.calculateStrength();
    }

    modifyDefenderStrength(value) {
        this.defenderStrengthModifier += value;
        this.calculateStrength();
    }

    getStealthAttackers() {
        return _.filter(this.attackers, card => card.needsStealthTarget());
    }

    determineWinner() {
        this.winnerDetermined = true;

        this.calculateStrength();

        let result = this.checkNoWinnerOrLoser();
        if(result.noWinner) {
            this.noWinnerMessage = result.message;
            this.loser = undefined;
            this.winner = undefined;
            this.loserStrength = this.winnerStrength = 0;
            this.strengthDifference = 0;

            return;
        }

        if(this.attackerStrength >= this.defenderStrength) {
            this.loser = this.defendingPlayer;
            this.loserStrength = this.defenderStrength;
            this.winner = this.attackingPlayer;
            this.winnerStrength = this.attackerStrength;
        } else {
            this.loser = this.attackingPlayer;
            this.loserStrength = this.attackerStrength;
            this.winner = this.defendingPlayer;
            this.winnerStrength = this.defenderStrength;
        }

        this.winner.winChallenge(this.challengeType, this.attackingPlayer === this.winner);
        this.loser.loseChallenge(this.challengeType, this.attackingPlayer === this.loser);
        this.strengthDifference = this.winnerStrength - this.loserStrength;
    }

    checkNoWinnerOrLoser() {
        const noWinnerRules = [
            {
                condition: () => this.attackerStrength === 0 && this.defenderStrength === 0,
                message: 'There is no winner or loser for this challenge because the attacker strength is 0'
            },
            {
                condition: () => this.attackerStrength >= this.defenderStrength && this.attackingPlayer.cannotWinChallenge,
                message: 'There is no winner or loser for this challenge because the attacker cannot win'
            },
            {
                condition: () => this.attackerStrength >= this.defenderStrength && this.attackers.length === 0,
                message: 'There is no winner or loser for this challenge because the attacker has no participants'
            },
            {
                condition: () => this.defenderStrength > this.attackerStrength && this.defendingPlayer.cannotWinChallenge,
                message: 'There is no winner or loser for this challenge because the defender cannot win'
            },
            {
                condition: () => this.defenderStrength > this.attackerStrength && this.defenders.length === 0,
                message: 'There is no winner or loser for this challenge because the defender has no participants'
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
        return this.defenderStrength <= 0 && this.attackerStrength > 0;
    }

    getClaim() {
        var claim = this.winner.getClaim();
        claim = this.winner.modifyClaim(this.winner, this.challengeType, claim);

        if(!this.isSinglePlayer) {
            claim = this.loser.modifyClaim(this.winner, this.challengeType, claim);
        }

        return claim;
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

    onCardLeftPlay(e, player, card) {
        if(!this.winnerDetermined) {
            this.removeFromChallenge(card);
        }
    }

    registerEvents(events) {
        this.events.register(events);
    }

    unregisterEvents() {
        this.events.unregisterAll();
    }

    finish() {
        _.each(this.attackers, card => card.inChallenge = false);
        _.each(this.defenders, card => card.inChallenge = false);
    }

    cancelChallenge() {
        this.cancelled = true;

        this.resetCards();

        this.game.addMessage('{0}\'s {1} challenge is cancelled', this.attackingPlayer, this.challengeType);
    }
}

module.exports = Challenge;
