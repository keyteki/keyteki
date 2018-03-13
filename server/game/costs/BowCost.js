class BowCost {
    constructor() {
        this.name = 'bow';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.isStronghold) && !card.bowed;
    }

    pay(cards, context) {
        context.game.applyGameAction(context, { bow: cards });
    }
}

module.exports = BowCost;
