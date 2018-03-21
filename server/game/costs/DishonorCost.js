class DishonorCost {
    constructor() {
        this.name = 'dishonor';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.allowGameAction('dishonor');
    }

    pay(cards, context) {
        context.game.applyGameAction(context, { dishonor: cards });
    }
}

module.exports = DishonorCost;
