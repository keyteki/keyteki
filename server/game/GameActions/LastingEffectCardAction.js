const CardGameAction = require('./CardGameAction');

class LastingEffectCardAction extends CardGameAction {
    setDefaultProperties() {
        this.duration = 'untilEndOfConflict';
        this.condition = null;
        this.until = null;
        this.effect = null;
        this.targetLocation = null;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect to {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' && this.targetLocation !== 'province') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let properties = {
            condition: this.condition,
            effect: this.effect,
            match: card,
            targetLocation: this.targetLocation,
            until: this.until
        };
        return super.createEvent('onEffectApplied', { card: card, context: context }, event => event.context.source[this.duration](() => properties));
    }
}

module.exports = LastingEffectCardAction;
