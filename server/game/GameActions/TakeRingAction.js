const RingAction = require('./RingAction');

class TakeFateRingAction extends RingAction {
    setDefaultProperties() {
        this.takeFate = false;
    }

    setup() {
        super.setup();
        this.name = 'takeRing';
        this.effectMsg = 'take {0}';
    }

    canAffect(ring, context) {
        return ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    getEvent(ring, context) {
        return this.createEvent('onTakeRing', { ring: ring, context: context }, () => {
            ring.claimRing(context.player);
            ring.contested = false;
            if(this.takeFate && context.player.checkRestrictions('takeFateFromRings')) {
                context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
                context.player.modifyFate(ring.fate);
                ring.removeFate();
            }
        });
    }
}

module.exports = TakeFateRingAction;
