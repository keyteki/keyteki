const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class StunAction extends CardGameAction {
    setup() {
        this.name = 'stun';
        this.targetType = ['creature'];
        this.effectMsg = 'stun {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(EVENTS.onStun, { card: card, context: context }, () =>
            card.stun()
        );
    }
}

module.exports = StunAction;
