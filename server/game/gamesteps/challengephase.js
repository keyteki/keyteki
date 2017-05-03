const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Challenge = require('../challenge.js');
const ChallengeFlow = require('./challenge/challengeflow.js');
const ActionWindow = require('./actionwindow.js');

class ChallengePhase extends Phase {
    constructor(game) {
        super(game, 'challenge');
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new ActionWindow(this.game, 'Before challenges', 'challengeBegin'),
            new SimpleStep(this.game, () => this.promptForChallenge())
        ]);
    }

    beginPhase() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        _.each(this.remainingPlayers, player => {
            player.activePlot.onBeginChallengePhase();
        });
    }

    promptForChallenge() {
        if(this.remainingPlayers.length === 0) {
            return true;
        }

        var currentPlayer = this.remainingPlayers[0];
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Military', method: 'initiateChallenge', arg: 'military' },
                    { text: 'Intrigue', method: 'initiateChallenge', arg: 'intrigue' },
                    { text: 'Power', method: 'initiateChallenge', arg: 'power' },
                    { text: 'Done', method: 'completeChallenges' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to initiate challenge'
        });

        return false;
    }

    initiateChallenge(attackingPlayer, challengeType) {
        if(!attackingPlayer.canInitiateChallenge(challengeType)) {
            return;
        }

        attackingPlayer.challengeType = challengeType;

        if(!attackingPlayer.activePlot.canChallenge(attackingPlayer, challengeType)) {
            return;
        }

        var defendingPlayer = this.chooseOpponent(attackingPlayer);
        if(defendingPlayer && !defendingPlayer.activePlot.canChallenge(attackingPlayer, challengeType)) {
            return;
        }

        var challenge = new Challenge(this.game, attackingPlayer, defendingPlayer, challengeType);
        this.game.currentChallenge = challenge;
        this.game.queueStep(new ChallengeFlow(this.game, challenge));
        this.game.queueStep(new SimpleStep(this.game, () => this.cleanupChallenge()));
    }

    cleanupChallenge() {
        this.game.currentChallenge.unregisterEvents();
        this.game.currentChallenge = null;
    }

    chooseOpponent(attackingPlayer) {
        return this.game.getOtherPlayer(attackingPlayer);
    }

    completeChallenges(player) {
        this.game.addMessage('{0} has finished their challenges', player);

        this.remainingPlayers.shift();
        return true;
    }
}

module.exports = ChallengePhase;
