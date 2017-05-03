const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.draw()),
            new ActionWindow(this.game, 'After cards drawn', 'draw')
        ]);
    }

    draw() {
        _.each(this.game.getPlayers(), p => {
            this.game.raiseEvent('beginDrawPhase', this, p);
            p.drawPhase();
        });
    }
}

module.exports = DrawPhase;
