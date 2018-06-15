class SpecificCardCost {
    constructor(action, cardFunc) {
        this.action = action;
        this.cardFunc = cardFunc;
    }

    canPay(context) {
        let card = this.cardFunc(context);
        return this.action.canAffect(card, context);
    }

    resolve(context, result = { resolved: false }) {
        let card = this.cardFunc(context);
        context.costs[this.action.name] = card;

        result.resolved = true;
        result.value = this.action.setTarget(card, context);
        return result;
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = SpecificCardCost;
