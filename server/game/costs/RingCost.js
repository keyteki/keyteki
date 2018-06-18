class RingCost {
    constructor(action, ringCondition = () => true, message) {
        this.action = action;
        this.action.costMessage = message;
        this.ringCondition = ringCondition;
        this.promptsPlayer = true;
    }

    canPay(context) {
        this.action.origin = context.player;
        let rings = Object.values(context.game.rings);
        return rings.some(ring => this.action.canAffect(ring, context));
    }

    resolve(context, result = { resolved: false }) {
        context.game.promptForRingSelect(context.player, {
            source: context.source,
            ringCondition: this.ringCondition,
            onSelect: (player, ring) => {
                context.costs[this.action.name] = ring;
                result.resolved = true;
                result.value = this.action.setTarget(ring, context);
                return true;
            },
            onCancel: () => {
                result.value = false;
                result.resolved = true;
            }
        });
        return result;
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = RingCost;
