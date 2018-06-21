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

    resolve(context, result) {
        context.game.promptForRingSelect(context.player, {
            context: context,
            buttons: result.canCancel ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            ringCondition: this.ringCondition,
            onSelect: (player, ring) => {
                context.costs[this.action.name] = ring;
                this.action.setTarget(ring);
                return true;
            },
            onCancel: () => result.cancelled = true
        });
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = RingCost;
