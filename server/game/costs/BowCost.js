class BowCost {
    constructor() {
        this.name = 'bow';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.isStronghold) && !card.bowed;
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.bowCard(card, context.source);
        }
    }
}

module.exports = BowCost;
