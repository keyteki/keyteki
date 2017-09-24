const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const HonorBidPrompt = require('./honorbidprompt.js');

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
            new HonorBidPrompt(this.game),
            new SimpleStep(game, () => this.tradeHonor()),
            new SimpleStep(game, () => this.drawConflict()),
            new ActionWindow(this.game, 'Action Window', 'draw')
        ]);
    }

    tradeHonor() {
        this.game.tradeHonorAfterBid();
    }

    drawConflict() {
        _.each(this.game.getPlayers(), p => {
            p.drawPhase();
        });
    }
}

module.exports = DrawPhase;
