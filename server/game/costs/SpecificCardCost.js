class SpecificCardCost {
    constructor(action, cardFunc) {
        this.action = action;
        this.cardFunc = cardFunc;
    }

    canPay(context) {
        let card = this.cardFunc(context);
        return this.action.isEligible(card, context);
    }

    resolve(context, result = { resolved: false }) {
        let card = this.cardFunc(context);
        context.costs[this.action.name] = card;

        result.resolved = true;
        result.value = card;
        return result;
    }

    pay(context) {
        return this.action.pay([context.costs[this.action.name]], context);
    }
}

module.exports = SpecificCardCost;
