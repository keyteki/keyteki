const _ = require('underscore');

const Effect = require('./Effect.js');

class RingEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || 'current';
    }

    getTargets() {
        return _.filter(this.game.rings, ring => this.match(ring));
    }
}

module.exports = RingEffect;
