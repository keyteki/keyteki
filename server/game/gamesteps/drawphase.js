const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game);
        this.initialise([
            new SimpleStep(game, () => this.draw())
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
