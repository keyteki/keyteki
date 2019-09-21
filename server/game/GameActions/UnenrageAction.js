const CardGameAction = require('./CardGameAction');

class UnenrageAction extends CardGameAction {
    setup() {
        this.name = 'unenrage';
        this.targetType = ['creature'];
        this.effectMsg = 'remove enrage from {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardUnenraged', { card: card, context: context }, () => card.unenrage());
    }
}

module.exports = UnenrageAction;
