class ParentCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return !!context.source.parent && this.action.isEligible(context.source.parent, context);
    }

    resolve(context, result = { resolved: false }) {
        context.costs[this.action.name] = context.source.parent;

        result.resolved = true;
        result.value = context.source.parent;
        return result;
    }

    pay(context) {
        return this.action.pay([context.costs[this.action.name]], context);
    }
}

module.exports = ParentCost;
