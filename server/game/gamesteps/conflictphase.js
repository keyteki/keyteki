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

 */

class ConflictPhase extends Phase {
    constructor(game) {
        super(game, 'conflict');
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new ActionWindow(this.game, 'Before conflicts', 'conflictBegin'),
            new SimpleStep(this.game, () => this.startConflictChoice())
        ]);
    }

    beginPhase() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.currentPlayer = this.remainingPlayers[0];
    }

    startConflictChoice(attackingPlayer = null) {
        let attacker = attackingPlayer;
        if(attacker === null) {
            attacker = this.currentPlayer;
        }

        this.game.queueStep(new SimpleStep(this.game, () => this.promptForConflictType(attacker)));

    }

    promptForConflictType(attackingPlayer) {
        if(this.remainingPlayers.length === 0) {
            return true;
        }

        let currentPlayer = attackingPlayer;
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Military', method: 'promptForConflictRing', arg: 'military' },
                    { text: 'Political', method: 'promptForConflictRing', arg: 'political' },
                    { text: 'Pass', method: 'passConflict' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to initiate conflict'
        });

        return false;
    }

    promptForConflictRing(attackingPlayer, conflictType) {
        let currentPlayer = attackingPlayer;

        this.conflictType = conflictType;
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Air', method: 'promptForConflictProvince', arg: 'air' },
                    { text: 'Earth', method: 'promptForConflictProvince', arg: 'earth' },
                    { text: 'Fire', method: 'promptForConflictProvince', arg: 'fire' },
                    { text: 'Void', method: 'promptForConflictProvince', arg: 'void' },
                    { text: 'Water', method: 'promptForConflictProvince', arg: 'water' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to choose conflict ring'
        });

        return false;
    }

    promptForConflictProvince(attackingPlayer, conflictRing) {
        var currentPlayer = attackingPlayer;

        this.conflictRing = conflictRing;
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Stronghold', method: 'initiateConflict', arg: 'stronghold province' },
                    { text: 'One', method: 'initiateConflict', arg: 'province 1' },
                    { text: 'Two', method: 'initiateConflict', arg: 'province 2' },
                    { text: 'Three', method: 'initiateConflict', arg: 'province 3' },
                    { text: 'Four', method: 'initiateConflict', arg: 'province 4' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to choose province'
        });

        return false;
    }

    initiateConflict(attackingPlayer, conflictProvince) {
        if(!attackingPlayer.canInitiateConflict(this.conflictType)) {
            return;
        }

        attackingPlayer.conflictType = this.conflictType;

        let defendingPlayer = this.chooseOpponent(attackingPlayer);

        var conflict = new Conflict(this.game, attackingPlayer, defendingPlayer, this.conflictType, this.conflictRing, conflictProvince);
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

    passConflict(player) {
        let otherPlayer = this.game.getOtherPlayer(player);
        let attacker = otherPlayer;

        if(typeof otherplayer === 'undefined') {
            attacker = player;
        }
        
        this.game.addMessage('{0} has passed the opportunity to declare a conflict', player);

        this.game.queueStep(new SimpleStep(this.game, () => this.startConflictChoice(attacker)));
        return true;
    }

    completeConflicts(player) {
        this.game.addMessage('{0} has finished their conflicts', player);

        this.remainingPlayers.shift();
        return true;
    }
}

module.exports = ConflictPhase;
