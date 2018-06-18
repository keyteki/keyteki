const RingAction = require('./RingAction');

class LastingEffectRingAction extends RingAction {
    setDefaultProperties() {
        this.duration = 'untilEndOfConflict';
        this.condition = null;
        this.until = null;
        this.effect = null;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect to {0}';
    }

    getEvent(ring, context) {
        let properties = {
            condition: this.condition,
            effect: this.effect,
            match: ring,
            until: this.until
        };
        return super.createEvent('onEffectApplied', { ring: ring, context: context }, event => event.context.source[this.duration](() => properties));
    }
}

module.exports = LastingEffectRingAction;
