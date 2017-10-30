class BowCost {
    constructor() {
        this.name = 'bow';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.isStronghold) && !card.kneeled;
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.bowCard(card);
        }
    }
}

module.exports = BowCost;
