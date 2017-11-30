class DishonorCost {
    constructor() {
        this.name = 'dishonor';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.allowGameAction('dishonor');
    }

    pay(cards, context) {
        let results = [];
        for(let card of cards) {
            results.push(context.player.dishonorCard(card, context.source));
        }
        return results;
    }
}

module.exports = DishonorCost;
