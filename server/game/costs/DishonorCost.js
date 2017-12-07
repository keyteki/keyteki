const _ = require('underscore');

class DishonorCost {
    constructor() {
        this.name = 'dishonor';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.allowGameAction('dishonor');
    }

    pay(cards, context) {
        return _.map(cards, card => context.player.dishonorCard(card, context.source));
    }
}

module.exports = DishonorCost;
