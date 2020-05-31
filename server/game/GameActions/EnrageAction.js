const CardGameAction = require('./CardGameAction');

class EnrageAction extends CardGameAction {
    setup() {
        this.name = 'enrage';
        this.targetType = ['creature'];
        this.effectMsg = 'enrage {0}';
    }

    canAffect(card, context) {
        if (card.location !== 'play area') {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardEnraged', { card: card, context: context }, () =>
            card.enrage()
        );
    }
}

module.exports = EnrageAction;
