const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Conflict = require('../conflict.js');
const ActionWindow = require('./actionwindow.js');
const GameActions = require('../GameActions/GameActions');

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
            new ActionWindow(this.game, 'Action Window', 'preConflict'),
            new SimpleStep(this.game, () => this.startConflictChoice())
        ]);
    }

    beginPhase() {
        this.currentPlayer = this.game.getFirstPlayer();
    }

    startConflictChoice() {
        if(this.currentPlayer.getConflictOpportunities() === 0 && this.currentPlayer.opponent) {
            this.currentPlayer = this.currentPlayer.opponent;
        }
        if(this.currentPlayer.getConflictOpportunities() > 0) {
            if(GameActions.initiateConflict().canAffect(this.currentPlayer, this.game.getFrameworkContext(this.currentPlayer))) {
                GameActions.initiateConflict().resolve(this.currentPlayer, this.game.getFrameworkContext(this.currentPlayer));
            } else {
                var conflict = new Conflict(this.game, this.currentPlayer, this.currentPlayer.opponent);
                conflict.passConflict('{0} passes their conflict opportunity as none of their characters can be declared as an attacker');
            }
            if(this.currentPlayer.opponent) {
                this.currentPlayer = this.currentPlayer.opponent;
            }
            this.game.queueStep(new ActionWindow(this.game, 'Action Window', 'preConflict'));
            this.game.queueStep(new SimpleStep(this.game, () => this.startConflictChoice()));
        } else {
            this.game.queueStep(new SimpleStep(this.game, () => this.claimImperialFavor()));
        }
    }

    claimImperialFavor() {
        let gloryTotals = this.game.getPlayersInFirstPlayerOrder().map(player => {
            return player.cardsInPlay.reduce((total, card) => total + card.getContributionToImperialFavor(), player.getClaimedRings().length + player.gloryModifier);
        });
        let winner = this.game.getFirstPlayer();
        if(winner.opponent) {
            if(gloryTotals[0] === gloryTotals[1]) {
                this.game.addMessage('Both players are tied in glory at {0}.  The imperial favor remains in its current state', gloryTotals[0]);
                this.game.raiseEvent('onFavorGloryTied');
                return;
            } else if(gloryTotals[0] < gloryTotals[1]) {
                winner = winner.opponent;
                this.game.addMessage('{0} succesfully claims the Emperor\'s favor with total glory of {1} vs {2}', winner, gloryTotals[1], gloryTotals[0]);
            } else {
                this.game.addMessage('{0} succesfully claims the Emperor\'s favor with total glory of {1} vs {2}', winner, gloryTotals[0], gloryTotals[1]);
            }
        }
        winner.claimImperialFavor();
    }
}

module.exports = ConflictPhase;
