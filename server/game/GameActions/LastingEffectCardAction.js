const CardGameAction = require('./CardGameAction');

class LastingEffectCardAction extends CardGameAction {
    setDefaultProperties() {
        this.duration = 'untilEndOfRound';
        this.condition = null;
        this.until = null;
        this.effect = [];
        this.targetLocation = null;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect to {0}';
    }

    update(context) {
        super.update(context);
        let effect = this.effect;
        if (!Array.isArray(effect)) {
            effect = [effect];
        }

        let effectProperties = {
            condition: this.condition,
            context: context,
            duration: this.duration,
            targetLocation: this.targetLocation,
            until: this.until,
            roundDuration: this.roundDuration
        };
        this.effect = effect.map((factory) =>
            factory(context.game, context.source, effectProperties)
        );
    }

    canAffect(card, context) {
        if (card.location !== 'play area' && !this.targetLocation) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let { effect } = this.propertyFactory(context);
        let properties = {
            condition: this.condition,
            context: context,
            effect: effect,
            match: card,
            targetLocation: this.targetLocation,
            until: this.until
        };
        let duration = this.until ? 'lastingEffect' : this.duration;
        return super.createEvent('onEffectApplied', { card: card, context: context }, (event) =>
            event.context.source[duration](() => properties)
        );
    }
}

module.exports = LastingEffectCardAction;
