class DiscardFromHandCost {
    constructor() {
        this.name = 'discardFromHand';
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    pay(cards, context) {
        context.player.discardCardsFromHand(cards, false);
    }
}

module.exports = DiscardFromHandCost;
