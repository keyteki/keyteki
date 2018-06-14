const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const HonorBidPrompt = require('./honorbidprompt.js');
const GameActions = require('../GameActions/GameActions');

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
            new SimpleStep(game, () => this.displayHonorBidPrompt()),
            new SimpleStep(game, () => this.drawConflictCards()),
            new ActionWindow(this.game, 'Action Window', 'draw')
        ]);
    }

    displayHonorBidPrompt() {
        this.game.queueStep(new HonorBidPrompt(this.game, 'Choose how many cards to draw'));
    }

    drawConflictCards() {
        for(let player of this.game.getPlayers()) {
            this.game.addMessage('{0} draws {1} cards for the draw phase', player, player.honorBid);
            GameActions.draw({ amount: player.honorBid }).resolve(player, this.game.getFrameworkContext());    
        }
    }
}

module.exports = DrawPhase;
