class ReturnToHandCost {
    constructor() {
        this.name = 'returnToHand';
    }

    isEligible(card) {
        return card.location === 'play area';
    }

    pay(cards, context) {
        let results = [];
        for(let card of cards) {
            results.push(context.player.returnCardToHand(card));
        }
        return results;
    }
}

module.exports = ReturnToHandCost;
