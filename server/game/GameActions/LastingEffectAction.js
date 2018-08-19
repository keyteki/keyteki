const GameAction = require('./GameAction');
const DelayedEffect = require('../DelayedEffect');

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
        this.gameAction = [];
        this.message = null;
        this.multipleTrigger = true;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect';
    }

    hasLegalTarget(context) {
        this.update(context);
        return !!this.effect.length || this.when && !!this.gameAction.length;
    }

    getEventArray(context) {
        if(this.when && this.gameAction.length) {
            let target = [];
            if(this.targetController !== 'opponent') {
                target.push(context.player);
            }
            if(this.targetController !== 'current' && context.player.opponent) {
                target.push(context.player.opponent);
            }
            this.effect = [new DelayedEffect(context.game, context.source, {
                when: this.when,
                gameAction: this.gameAction,
                message: this.message,
                multipleTrigger: this.multipleTrigger,
                target: target,
                context: context
            })];
        }
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
