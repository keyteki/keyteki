class BreakCost {
    constructor() {
        this.name = 'break';
    }

    isEligible(card) {
        return card.type === 'province' && !card.isBroken && card.allowGameAction('break');
    }

    pay(cards, context) {
        context.game.applyGameAction(context, { break: cards });
    }
}

module.exports = BreakCost;
