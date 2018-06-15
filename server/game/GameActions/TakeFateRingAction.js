const RingAction = require('./RingAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class TakeFateRingAction extends RingAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'takeFate';
        this.effectMsg = 'take ' + this.amount + ' fate from {0}';
    }

    canAffect(ring, context) {
        return context.player.checkRestrictions('takeFateFromRings', context) &&
               ring.fate > 0 && this.amount > 0 && super.canAffect(ring, context);
    }

    checkEventCondition(event) {
        return event.recipient.checkRestrictions('takeFateFromRings', event.context) &&
               event.origin.fate > 0 && super.canAffect(event.origin, event.context);
    }

    getEvent(ring, context) {
        return new MoveFateEvent({ context: context }, this.amount, ring, context.player, this);
    }
}

module.exports = TakeFateRingAction;
