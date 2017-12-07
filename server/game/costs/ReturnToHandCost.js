const _ = require('underscore');

class ReturnToHandCost {
    constructor() {
        this.name = 'returnToHand';
    }

    isEligible(card) {
        return card.location === 'play area';
    }

    pay(cards, context) {
        return _.map(cards, card => context.player.returnCardToHand(card));
    }
}

module.exports = ReturnToHandCost;
