const Effect = require('./Effect.js');

class CardEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        if (!properties.match && properties.duration === 'persistentEffect') {
            this.match = (card, context) => card === context.source;
        }

        this.targetController = properties.targetController || 'current';
        this.targetLocation =
            properties.targetLocation || (properties.location === 'any' ? 'any' : 'play area');
    }

    isValidTarget(target) {
        if (target === this.match) {
            return true;
        }

        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== 'current' || target.controller === this.context.player) &&
            (this.targetController !== 'opponent' || target.controller !== this.context.player)
        );
    }

    getTargets() {
        if (this.targetLocation === 'any') {
            return this.game.allCards.filter((card) => this.match(card, this.context));
        } else if (this.targetLocation === 'play area') {
            return this.game.cardsInPlay.filter((card) => this.match(card, this.context));
        }

        return this.game.allCards.filter(
            (card) => this.match(card, this.context) && card.location === this.targetLocation
        );
    }
}

module.exports = CardEffect;
