class DiscardFateCost {
    constructor() {
        this.name = 'discardFate';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.fate > 0 && card.allowGameAction('removeFate');
    }

    pay(cards, context) {
        context.game.applyGameAction(context, { removeFate: cards });
    }
}

module.exports = DiscardFateCost;
