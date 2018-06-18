class ParentCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return context.source.parent && this.action.canAffect(context.source.parent, context);
    }

    resolve(context, result = { resolved: false }) {
        context.costs[this.action.name] = context.source.parent;

        result.resolved = true;
        result.value = this.action.setTarget(context.source.parent, context);
        return result;
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = ParentCost;
