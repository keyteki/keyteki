const Effect = require('./Effect.js');

class CardEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || 'current';
        this.targetLocation = properties.targetLocation || 'play area';
    }

    isValidTarget(target) {
        if(target === this.match) {
            return true;
        }
        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== 'current' || target.controller === this.source.controller) &&
            (this.targetController !== 'opponent' || target.controller !== this.source.controller)
        );
    }

    getTargets() {
        if(this.targetLocation === 'any') {
            return this.game.allCards.filter(this.match);
        } else if(this.targetLocation === 'province') {
            return this.game.provinceCards.filter(this.match);
        } else if(this.targetLocation === 'play area') {
            return this.game.findAnyCardsInPlay(this.match);
        }
        return this.game.allCards.filter(card => this.match(card) && card.location === this.targetLocation);
    }
}

module.exports = CardEffect;
