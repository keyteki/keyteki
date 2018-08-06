const PlayerAction = require('./PlayerAction');

class LastingEffectAction extends PlayerAction {
    constructor(propertyFactory, duration) {
        super(propertyFactory);
        this.duration = duration;
    }

    setDefaultProperties() {
        this.condition = null;
        this.effect = [];
        this.targetController = this.duration === 1 ? 'current' : 'opponent';
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect';
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.effect.length > 0;
    }

    getEventArray(context) {
        let properties = {
            condition: this.condition,
            effect: this.effect,
            roundDuration: this.duration,
            targetController: this.targetController
        };
        return [super.createEvent('applyLastingEffect', { context: context }, event => event.context.source.roundDurationEffect(properties))];
    }
}

module.exports = LastingEffectAction;
