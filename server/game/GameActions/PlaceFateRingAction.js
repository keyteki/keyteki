const RingAction = require('./RingAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class PlaceFateRingAction extends RingAction {
    setDefaultProperties() {
        this.amount = 1;
        this.origin = null;
    }

    setup() {
        super.setup();
        this.name = 'placeFate';
        if(this.origin) {
            this.effectMsg = 'move ' + this.amount + ' fate from {1} to {0}';
        } else {
            this.effectMsg = 'place ' + this.amount + ' fate on {0}';
        }
        this.effectArgs = () => {
            return this.origin;
        };
        this.cost = 'spending ' + this.amount + ' fate to {0}';
    }

    canAffect(ring, context) {
        if(this.origin && !this.origin.checkRestrictions('spendFate', context) || this.origin.fate < this.amount) {
            return false;
        }
        return this.amount > 0 && super.canAffect(ring, context);
    }

    getEvent(ring, context) {
        return new MoveFateEvent({ context: context, ring: ring }, this.amount, this.origin, ring, this);
    }
}

module.exports = PlaceFateRingAction;
