class ReturnToHandCost {
    constructor() {
        this.name = 'returnToHand';
    }

    isEligible(card) {
        return card.location === 'play area';
    }

    pay(cards, context) {
        context.game.applyGameAction(context, { returnToHand: cards });
    }
}

module.exports = ReturnToHandCost;
