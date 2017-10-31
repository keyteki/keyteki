class SacrificeCost {
    constructor() {
        this.name = 'sacrifice';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.type === 'holding') && !card.facedown;
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.sacrificeCard(card);
        }
    }
}

module.exports = SacrificeCost;
