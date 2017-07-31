const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const DrawBidPrompt = require('./draw/drawbidprompt.js');
//const DrawRevealPrompt = require('./draw/drawrevealprompt.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.bidPrompt()),
            new SimpleStep(game, () => this.showBids()),
            new ActionWindow(this.game, 'After bids revealed', 'draw'),
            new SimpleStep(game, () => this.tradeHonor()),
            new SimpleStep(game, () => this.drawConflict())
        ]);
    }

    bidPrompt() {
        _.each(this.game.getPlayers(), p => {
            this.game.raiseEvent('beginDrawPhase', this, p);
            this.queueStep(new DrawBidPrompt(this.game, p));
        });
    }

    showBids() {


        _.each(this.game.getPlayers(), p => {
            p.showBid = p.drawBid;
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
            } else if(otherPlayer.drawBid > currentPlayer.drawBid) {
                honorDifference = otherPlayer.drawBid - currentPlayer.drawBid;
                this.game.transferHonor(currentPlayer, otherPlayer, honorDifference);
            }
        }

    }

    drawConflict() {
        _.each(this.game.getPlayers(), p => {
            this.game.raiseEvent('beginDrawPhase', this, p);
            p.drawPhase();
        });
    }
}

module.exports = DrawPhase;
