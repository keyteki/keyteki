const _ = require('underscore');
const Player = require('./player.js');

class Challenge {
    constructor(game, attackingPlayer, defendingPlayer, challengeType) {
        this.game = game;
        this.attackingPlayer = attackingPlayer;
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.challengeType = challengeType;
        this.attackers = [];
        this.defenders = [];
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
        this.attackers = attackers;
        this.markAsParticipating(attackers);

        // TODO: Remove duplicated logic.
        this.attackingPlayer.cardsInChallenge = _(attackers);
    }

    addDefenders(defenders) {
        this.defenders = defenders;
        this.markAsParticipating(defenders);

        // TODO: Remove duplicated logic.
        this.defendingPlayer.cardsInChallenge = _(defenders);
    }

    removeFromChallenge(card) {
        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);
        this.calculateStrength();

        // TODO: Remove duplicated logic
        this.attackingPlayer.cardsInChallenge = _(this.attackers);
        this.defendingPlayer.cardsInChallenge = _(this.defenders);
    }

    markAsParticipating(cards) {
        _.each(cards, card => {
            card.kneeled = true;
        });
    }

    calculateStrength() {
        this.attackerStrength = this.calculateStrengthFor(this.attackers);
        this.defenderStrength = this.calculateStrengthFor(this.defenders);

        // TODO: Remove duplicated logic
        this.attackingPlayer.challengeStrength = this.attackerStrength;
        this.defendingPlayer.challengeStrength = this.defenderStrength;
    }

    calculateStrengthFor(cards) {
        return _.reduce(cards, (sum, card) => {
            return sum + card.getStrength();
        }, 0);
    }

    getStealthAttackers() {
        return _.filter(this.attackers, card => card.needsStealthTarget());
    }

    determineWinner() {
        this.calculateStrength();
        if(this.attackerStrength >= this.defenderStrength) {
            this.loser = this.defendingPlayer;
            this.winner = this.attackingPlayer;
        } else {
            this.loser = this.attackingPlayer;
            this.winner = this.defendingPlayer;
        }

        this.winner.winChallenge(this.challengeType);
        this.loser.loseChallenge(this.challengeType);
        this.strengthDifference = this.winner.challengeStrength - this.loser.challengeStrength;
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    isUnopposed() {
        return this.defenderStrength <= 0;
    }

    getClaim() {
        var claim = this.winner.activePlot.getClaim();
        claim = this.winner.modifyClaim(this.winner, this.challengeType, claim);

        if(!this.isSinglePlayer) {
            claim = this.loser.modifyClaim(this.winner, this.challengeType, claim);
        }

        return claim;
    }

    onCardLeftPlay(e, player, card) {
        this.removeFromChallenge(card);
    }

    registerEvents(events) {
        this.events = [];

        _.each(events, event => {
            this[event] = this[event].bind(this);

            this.game.on(event, this[event]);

            this.events.push(event);
        });
    }

    unregisterEvents() {
        _.each(this.events, event => {
            this.game.removeListener(event, this[event]);
        });
    }
}

module.exports = Challenge;
