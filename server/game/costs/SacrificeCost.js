class SacrificeCost {
    constructor() {
        this.name = 'sacrifice';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.type === 'holding') && !card.facedown;
    }

    pay(cards, context) {
        context.game.applyGameAction(context, { sacrifice: cards });
    }
}

module.exports = SacrificeCost;
