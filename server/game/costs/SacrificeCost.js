class SacrificeCost {
    constructor() {
        this.name = 'sacrifice';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.type === 'holding') && !card.facedown;
    }

    pay(cards, context) {
        let results = [];
        for(let card of cards) {
            results.push(context.player.sacrificeCard(card));
        }
        return results;
    }
}

module.exports = SacrificeCost;
