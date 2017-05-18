const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Conflict = require('../conflict.js');
const ConflictFlow = require('./challenge/conflictflow.js');
const ActionWindow = require('./actionwindow.js');

class ConflictPhase extends Phase {
    constructor(game) {
        super(game, 'conflict');
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new ActionWindow(this.game, 'Before conflicts', 'conflictBegin'),
            new SimpleStep(this.game, () => this.promptForConflict())
        ]);
    }

    beginPhase() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        _.each(this.remainingPlayers, player => {
            player.activePlot.onBeginConflictPhase();
        });
    }

    promptForConflict() {
        if(this.remainingPlayers.length === 0) {
            return true;
        }

        var currentPlayer = this.remainingPlayers[0];
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Military', method: 'initiateConflict', arg: 'military' },
                    { text: 'Political', method: 'initiateConflict', arg: 'intrigue' },
                    { text: 'Done', method: 'completeConflicts' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to initiate conflict'
        });

        return false;
    }

    initiateConflict(attackingPlayer, conflictType) {
        if(!attackingPlayer.canInitiateConflict(conflictType)) {
            return;
        }

        attackingPlayer.conflictType = conflictType;

        if(!attackingPlayer.activePlot.canConflict(attackingPlayer, conflictType)) {
            return;
        }

        var defendingPlayer = this.chooseOpponent(attackingPlayer);
        if(defendingPlayer && !defendingPlayer.activePlot.canConflict(attackingPlayer, conflictType)) {
            return;
        }

        var conflict = new Conflict(this.game, attackingPlayer, defendingPlayer, conflictType);
        this.game.currentConflict = conflict;
        this.game.queueStep(new ConflictFlow(this.game, conflict));
        this.game.queueStep(new SimpleStep(this.game, () => this.cleanupConflict()));
    }

    cleanupConflict() {
        this.game.currentConflict.unregisterEvents();
        this.game.currentConflict = null;
    }

    chooseOpponent(attackingPlayer) {
        return this.game.getOtherPlayer(attackingPlayer);
    }

    completeConflicts(player) {
        this.game.addMessage('{0} has finished their conflicts', player);

        this.remainingPlayers.shift();
        return true;
    }
}

module.exports = ConflictPhase;
