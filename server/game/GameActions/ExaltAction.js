const { EVENTS } = require('../Events/types');
const AddTokenAction = require('./AddTokenAction');

class ExaltAction extends AddTokenAction {
    setDefaultProperties() {
        this.amount = 1;
        this.player = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'exalt';
        this.effectMsg = 'exalt {0}';
    }

    canAffect(card, context) {
        return this.amount > 0 && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onExalt,
            { card: card, context: context, amount: this.amount },
            () => card.addToken('amber', this.amount)
        );
    }
}

module.exports = ExaltAction;
