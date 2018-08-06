const RingAction = require('./RingAction');
const RingEffects = require('../RingEffects');

class ResolveElementAction extends RingAction {
    setDefaultProperties() {
        this.optional = false;
        this.physicalRing = null;
    }

    setup() {
        super.setup();
        this.name = 'resolveElement';
        this.effectMsg = 'resolve {0} effect';
    }

    getEventArray(context) {
        if(this.target.length > 1) {
            let sortedRings = this.target.sort((a, b) => {
                let aPriority = RingEffects.contextFor(context.player, a.element).ability.defaultPriority;
                let bPriority = RingEffects.contextFor(context.player, b.element).ability.defaultPriority;
                return context.player.firstPlayer ? aPriority - bPriority : bPriority - aPriority;
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
        let params = {
            context: context,
            optional: optional,
            physicalRing: this.physicalRing,
            player: context.player,
            ring: ring
        };
        return super.createEvent('onResolveRingElement', params, () => {
            context.game.resolveAbility(RingEffects.contextFor(context.player, ring.element, optional));
        });
    }
}

module.exports = ResolveElementAction;
