const _ = require('underscore');

class SacrificeCost {
    constructor() {
        this.name = 'sacrifice';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.type === 'holding') && !card.facedown;
    }

    pay(cards, context) {
        return _.map(cards, card => context.player.sacrificeCard(card));
    }
}

module.exports = SacrificeCost;
