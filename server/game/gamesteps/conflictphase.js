const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Conflict = require('../conflict.js');
const ConflictFlow = require('./conflict/conflictflow.js');
const ActionWindow = require('./actionwindow.js');

/*
III Conflict Phase
3.1 Conflict phase begins.
    ACTION WINDOW
    NOTE: After this action window, if no conflict
    opporunities remain, proceed to (3.4).
3.2 Next player in player order declares a 
    conflict(go to Conflict Resolution), or passes
    (go to 3.3).
3.3 Conflict Ends/Conflict was passed. Return to 
    the action window following step (3.1).
3.4 Determine Imperial Favor.
3.4.1 Glory count.
3.4.2 Claim Imperial Favor.
3.5 Conflict phase ends.

Conflict Resolution
3.2 Declare Conflict
3.2.1 Declare defenders
3.2.2 CONFLICT ACTION WINDOW
    (Defender has first opportunity)
3.2.3 Compare skill values.
3.2.4 Apply unopposed.
3.2.5 Break province.
3.2.6 Resolve Ring effects.
3.2.7 Claim ring.
3.2.8 Return home. Go to (3.3).
 */

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
                    { text: 'Political', method: 'initiateConflict', arg: 'political' },
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
