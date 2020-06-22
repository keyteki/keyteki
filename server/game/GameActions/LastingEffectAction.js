const GameAction = require('./GameAction');
const Effects = require('../effects.js');

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
        this.when = null;
        this.gameAction = null;
        this.message = null;
        this.match = null;
        this.multipleTrigger = true;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect';
    }

    hasLegalTarget(context) {
        this.update(context);
        return !!this.effect.length || (this.when && !!this.gameAction);
    }

    getEventArray(context) {
        if (this.when && this.gameAction) {
            this.effect = [
                Effects.lastingAbilityTrigger({
                    when: this.when,
                    gameAction: this.gameAction,
                    message: this.message,
                    multipleTrigger: this.multipleTrigger,
                    context: context
                })
            ];
        }

        let properties = {
            condition: this.condition,
            context: context,
            effect: this.effect,
            match: this.match,
            targetController: this.when ? 'current' : this.targetController
        };
        if (this.until) {
            properties.until = this.until;
            return [
                super.createEvent('applyLastingEffect', { context: context }, (event) =>
                    event.context.source.lastingEffect(() => properties)
                )
            ];
        }
        properties.roundDuration = this.duration;
        return [
            super.createEvent('applyLastingEffect', { context: context }, (event) =>
                event.context.source.roundDurationEffect(properties)
            )
        ];
    }
}

module.exports = LastingEffectAction;
