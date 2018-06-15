class DiscardFromHandCost {
    constructor() {
        this.name = 'discardFromHand';
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    payEvent(cards, context) {
        return context.game.getEvent('payCosts', {}, () => context.player.discardCardsFromHand(cards, false));
    }
}

module.exports = DiscardFromHandCost;
