const GameAction = require('./GameAction');
const Effects = require('../effects.js');

class LastingEffectAction extends GameAction {
    constructor(propertyFactory, roundDuration) {
        super(propertyFactory);
        this.roundDuration = roundDuration;
    }

    setDefaultProperties() {
        this.condition = null;
        this.effect = [];
        this.targetController =
            this.roundDuration === 1 ? 'current' : this.roundDuration === 2 ? 'opponent' : 'any';
        this.until = null;
        this.forceNextRound = false;

        // lasting ability trigger properties
        this.when = null;
        this.gameAction = null;
        this.message = null;
        this.messageArgs = [];
        this.match = null;
        this.preferActionPromptMessage = false;
        this.multipleTrigger = true;
        this.triggeredAbilityType = null;
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
                    messageArgs: this.messageArgs,
                    preferActionPromptMessage: this.preferActionPromptMessage,
                    multipleTrigger: this.multipleTrigger,
                    context: context,
                    triggeredAbilityType: this.triggeredAbilityType
                })
            ];
        }

        let properties = {
            condition: this.condition,
            context: context,
            effect: this.effect,
            match: this.match,
            targetController: this.targetController,
            until: this.until,
            roundDuration: this.roundDuration,
            forceNextRound: this.forceNextRound
        };

        return [
            super.createEvent('applyLastingEffect', { context: context }, (event) =>
                event.context.source.lastingEffect(() => properties)
            )
        ];
    }
}

module.exports = LastingEffectAction;
