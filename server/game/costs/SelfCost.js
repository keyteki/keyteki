class SelfCost {
    constructor(action, unpayAction) {
        this.action = action;
        this.unpayAction = unpayAction;
    }

    canPay(context) {
        return this.action.canAffect(context.source, context);
    }

    resolve(context, result = { resolved: false }) {
        context.costs[this.action.name] = context.source;

        result.resolved = true;
        result.value = this.action.setTarget(context.source, context);
        return result;
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = SelfCost;
