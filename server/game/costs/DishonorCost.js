class DishonorCost {
    constructor() {
        this.name = 'dishonor';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.allowGameAction('dishonor');
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.dishonorCard(card, context.source);
        }
    }
}

module.exports = DishonorCost;
