const _ = require('underscore');

const Effect = require('./Effect.js');

class PlayerEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || 'current';
        if(typeof this.match !== 'function') {
            this.match = player => true; // eslint-disable-line no-unused-vars
        }

    }

    isValidTarget(target) {
        if(this.targetController === 'current' && target === this.source.controller.opponent) {
            return false;
        } else if(this.targetController === 'opponent' && target === this.source.controller) {
            return false;
        }
        return true;
    }

    getTargets() {
        return _.filter(this.game.getPlayers(), player => this.match(player));
    }
}

module.exports = PlayerEffect;
