const CardGameAction = require('./CardGameAction');

class ExhaustAction extends CardGameAction {
    setup() {
        this.name = 'exhaust';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'exhaust {0}';
    }

    canAffect(card, context) {
        if (card.location !== 'play area') {
            return false;
        }

        return super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return !event.card.exhausted && super.checkEventCondition(event);
    }

    getEvent(card, context) {
        return super.createEvent('onCardExhausted', { card: card, context: context }, () =>
            card.exhaust()
        );
    }
}

module.exports = ExhaustAction;
