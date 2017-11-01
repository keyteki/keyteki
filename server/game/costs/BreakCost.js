class BreakCost {
    constructor() {
        this.name = 'break';
    }

    isEligible(card) {
        return card.type === 'province' && !card.isBroken;
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.breakProvince(card);
        }
    }
}

module.exports = BreakCost;
