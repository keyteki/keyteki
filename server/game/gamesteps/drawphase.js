const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const DrawBidPrompt = require('./draw/drawbidprompt.js');

/*
II Draw Phase
2.1 Draw phase begins.
2.2 Honor bid.
2.3 Reveal honor dials.
2.4 Transfer honor.
2.5 Draw cards.
    ACTION WINDOW
2.6 Draw phase ends.
 */

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.bidPrompt()),
            new SimpleStep(game, () => this.showBids()),
            new SimpleStep(game, () => this.tradeHonor()),
            new SimpleStep(game, () => this.drawConflict()),
            new ActionWindow(this.game, 'Action Window', 'draw')
        ]);
    }

    bidPrompt() {
        _.each(this.game.getPlayers(), p => {
            this.queueStep(new DrawBidPrompt(this.game, p));
        });
    }

    showBids() {


        _.each(this.game.getPlayers(), p => {
            p.showBid = p.drawBid;
            this.game.raiseEvent('onHonorDialsRevealed', p.drawBid);
        });
    }

    tradeHonor() {

        var honorDifference = 0;
        var remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        let currentPlayer = remainingPlayers.shift();
        if(remainingPlayers.length > 0) {

            var otherPlayer = this.game.getOtherPlayer(currentPlayer);
            if(currentPlayer.drawBid > otherPlayer.drawBid) {
                honorDifference = currentPlayer.drawBid - otherPlayer.drawBid;
                this.game.transferHonor(otherPlayer, currentPlayer, honorDifference);
                this.game.addMessage('{0} gives {1} {2} honor', currentPlayer, otherPlayer, honorDifference);
            } else if(otherPlayer.drawBid > currentPlayer.drawBid) {
                honorDifference = otherPlayer.drawBid - currentPlayer.drawBid;
                this.game.transferHonor(currentPlayer, otherPlayer, honorDifference);
                this.game.addMessage('{0} gives {1} {2} honor', otherPlayer, currentPlayer, honorDifference);
            }
        }

    }

    drawConflict() {
        _.each(this.game.getPlayers(), p => {
            p.drawPhase();
        });
    }
}

module.exports = DrawPhase;
