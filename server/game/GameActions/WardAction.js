const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class WardAction extends CardGameAction {
    setup() {
        this.name = 'ward';
        this.targetType = ['creature'];
        this.effectMsg = 'ward {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(EVENTS.onWard, { card: card, context: context }, () =>
            card.ward()
        );
    }
}

module.exports = WardAction;
