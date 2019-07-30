const CardGameAction = require('./CardGameAction');

class ExhaustAction extends CardGameAction {
    setDefaultProperties() {
        this.used = true;
    }

    setup() {
        this.name = 'exhaust';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'exhaust {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let eventName = 'onCardExhausted';
        if(!this.used) {
            eventName = 'onCardExhaustedWithoutUse';
        }
        return super.createEvent(eventName, { card: card, context: context }, () => card.exhaust());
    }
}

module.exports = ExhaustAction;
