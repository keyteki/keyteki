const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class CardLastingEffectAction extends CardGameAction {
    setDefaultProperties() {
        this.duration = 'untilPlayerTurnEnd';
        this.condition = null;
        this.until = null;
        this.effect = [];
        /**
         * Controls the location that the target card must have for the lasting
         * effect event to be created. Has no effect over when the effect is
         * actually active (though see {@link Card#updateEffects} for specifics
         * about adding/removing effects based on location). Defaults to `["play
         * area"]`, meaning the card must be in play to get the effect added.
         *
         * May be an array of locations or "any."
         *
         * @type string[] | "any"
         */
        this.allowedLocations = ['play area'];
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
            until: this.until
        };
        this.effect = effect.map((factory) =>
            factory(context.game, context.source, effectProperties)
        );
    }

    canAffect(card, context) {
        if (this.allowedLocations !== 'any') {
            if (!this.allowedLocations.includes(card.location)) {
                return false;
            }
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let { effect } = this.propertyFactory(context);
        let properties = {
            condition: this.condition,
            context: context,
            effect: effect,
            effectController: context.player,
            match: card,
            until: this.until
        };
        let duration = this.until ? 'lastingEffect' : this.duration;
        return super.createEvent(
            EVENTS.onEffectApplied,
            { card: card, context: context },
            (event) => event.context.source[duration](() => properties)
        );
    }
}

module.exports = CardLastingEffectAction;
