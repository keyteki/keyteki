const Effect = require('./Effect.js');

class PlayerEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || 'current';
        if (typeof this.match !== 'function') {
            this.match = (player, context) => true; // eslint-disable-line no-unused-vars
        }
    }

    isValidTarget(target) {
        if (this.targetController === 'current' && target === this.context.player.opponent) {
            return false;
        } else if (this.targetController === 'opponent' && target === this.context.player) {
            return false;
        }

        return true;
    }

    getTargets() {
        return this.game.getPlayers().filter((player) => this.match(player, this.context));
    }
}

module.exports = PlayerEffect;
