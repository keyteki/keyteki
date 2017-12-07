class DiscardFateCost {
    constructor() {
        this.name = 'discardFate';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.fate > 0 && card.allowGameAction('removeFate');
    }

    pay(cards) {
        for(let card of cards) {
            card.modifyFate(-1);
        }
    }
}

module.exports = DiscardFateCost;
