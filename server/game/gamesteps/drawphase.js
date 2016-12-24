const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.draw()),
            new SimpleStep(game, () => this.endPhase())
        ]);
    }

    draw() {
        _.each(this.game.getPlayers(), p => {
            this.game.raiseEvent('beginDrawPhase', this, p);
            p.drawPhase();
        });
    }

    endPhase() {
        this.game.raiseEvent('onPhaseEnd', 'draw');
    }    
}

module.exports = DrawPhase;
