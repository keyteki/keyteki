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
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.currentPlayer = this.remainingPlayers[0];
        this.game.militaryConflictCompleted = false;
        this.game.politicalConflictCompleted = false;
    }

    startConflictChoice(attackingPlayer = null) {
        if(attackingPlayer) {
            this.currentPlayer = attackingPlayer;
        }
        if(!this.currentPlayer.canInitiateConflict() && this.currentPlayer.opponent) {
            this.currentPlayer = this.currentPlayer.opponent;
        }
        if(this.currentPlayer.canInitiateConflict()) {
            var conflict = new Conflict(this.game, this.currentPlayer, this.game.getOtherPlayer(this.currentPlayer));
            this.game.currentConflict = conflict;
            let availableConflictTypes = _.filter(['military', 'political'], type => this.currentPlayer.canInitiateConflict(type));
            if(this.currentPlayer.cardsInPlay.any(card => _.any(availableConflictTypes, type => card.canDeclareAsAttacker(type)))) {
                this.game.queueStep(new ConflictFlow(this.game, conflict));
            } else {
                this.game.addMessage('{0} passes their conflict opportunity as none of their characters can be declared as an attacker', this.currentPlayer);
                conflict.passed = true;
                this.currentPlayer.conflicts.usedConflictOpportunity();
                this.game.queueSimpleStep(() => this.game.raiseEvent('onConflictPass', { conflict: conflict }));
            }
            this.game.queueStep(new SimpleStep(this.game, () => this.cleanupConflict()));
        } else {
            this.game.queueStep(new SimpleStep(this.game, () => this.determineImperialFavor()));
            this.game.queueStep(new SimpleStep(this.game, () => this.countGlory()));
            this.game.queueStep(new SimpleStep(this.game, () => this.claimImperialFavor()));            
        }
    }
   
    determineImperialFavor() {
        this.game.raiseEvent('onDetermineImperialFavor');
    }
    
    countGlory() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => player.getFavor());
    }
    
    claimImperialFavor() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);
        let winner = this.currentPlayer;
        if(otherPlayer) {
            if(this.currentPlayer.totalGloryForFavor === otherPlayer.totalGloryForFavor) {
                this.game.addMessage('Both players are tied in glory at {0}.  The imperial favor remains in its current state', this.currentPlayer.totalGloryForFavor);
                this.game.raiseEvent('onFavorGloryTied');
                return;
            } else if(this.currentPlayer.totalGloryForFavor < otherPlayer.totalGloryForFavor) {
                winner = otherPlayer;
            }
            this.game.addMessage('{0} succesfully claims the Emperor\'s favor with total glory of {1} vs {2}', winner, winner.totalGloryForFavor, winner.opponent.totalGloryForFavor);
            winner.opponent.loseImperialFavor();
        }
        winner.claimImperialFavor();
    }
    
    cleanupConflict() {
        if(!this.game.currentConflict.isSinglePlayer && !this.game.currentConflict.winnerGoesStraightToNextConflict) {
            this.currentPlayer = this.game.getOtherPlayer(this.currentPlayer);
        }
        if(!this.game.currentConflict.winnerGoesStraightToNextConflict) {
            this.game.currentConflict = null;
            this.game.queueStep(new ActionWindow(this.game, 'Action Window', 'preConflict'));            
        } else {
            this.game.currentConflict = null;
        }
        this.game.queueStep(new SimpleStep(this.game, () => this.startConflictChoice(this.currentPlayer)));
    }

    chooseOpponent(attackingPlayer) {
        return this.game.getOtherPlayer(attackingPlayer);
    }

    passConflict(player) {      
        this.game.addMessage('{0} has passed the opportunity to declare a conflict', player);
    }

    completeConflicts(player) {
        this.game.addMessage('{0} has finished their conflicts', player);

        this.remainingPlayers.shift();
        return true;
    }
}

module.exports = ConflictPhase;
