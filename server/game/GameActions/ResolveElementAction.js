const RingAction = require('./RingAction');
const RingEffects = require('../RingEffects');

class ResolveElementAction extends RingAction {
    setDefaultProperties() {
        this.optional = false;
    }

    setup() {
        super.setup();
        this.name = 'resolveElement';
        this.effectMsg = 'resolve {0} effect';
    }

    getEventArray(context) {
        if(this.target.length > 1) {
            let sortedRings = this.target.sort(ring => {
                let priority = RingEffects.contextFor(context.player, ring.element).ability.defaultPriority;
                return context.player.firstPlayer ? priority : -priority;
            });
            let effectObjects = sortedRings.map(ring => ({
                title: RingEffects.getRingName(ring.element) + ' Effect',
                handler: () => context.game.openEventWindow(this.getEvent(ring, context, false))
            }));
            return [super.createEvent('unnamedEvent', {}, () => context.game.openSimultaneousEffectWindow(effectObjects))];
        }
        return super.getEventArray(context);
    }

    getEvent(ring, context, optional = this.optional) {
        return super.createEvent('onResolveRingElement', { player: context.player, ring: ring, context: context, optional: optional }, () => {
            context.game.resolveAbility(RingEffects.contextFor(context.player, ring.element, optional));
        });
    }
}

module.exports = ResolveElementAction;
