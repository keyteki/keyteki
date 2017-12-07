class SelfCost {
    constructor(action, unpayAction) {
        this.action = action;
        this.unpayAction = unpayAction;
    }

    canPay(context) {
        return this.action.isEligible(context.source, context);
    }

    resolve(context, result = { resolved: false }) {
        context.costs[this.action.name] = context.source;

        result.resolved = true;
        result.value = context.source;
        return result;
    }

    pay(context) {
        return this.action.pay([context.costs[this.action.name]], context);
    }

    canUnpay(context) {
        return !!this.unpayAction && this.unpayAction.isEligible(context.source, context);
    }

    unpay(context) {
        this.unpayAction.pay([context.source], context);
    }
}

module.exports = SelfCost;
