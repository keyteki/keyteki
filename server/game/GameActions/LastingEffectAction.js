const GameAction = require('./GameAction');

class LastingEffectAction extends GameAction {
    constructor(propertyFactory, duration = 2) {
        super(propertyFactory);
        this.duration = this.duration || duration;
    }

    setDefaultProperties() {
        this.condition = null;
        this.effect = [];
        this.targetController = this.duration === 1 ? 'current' : 'opponent';
        this.until = null;
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
            targetController: this.targetController,
            until: this.until
        };
        return [super.createEvent('applyLastingEffect', { context: context }, event => event.context.source.roundDurationEffect(properties))];
    }
}

module.exports = LastingEffectAction;
