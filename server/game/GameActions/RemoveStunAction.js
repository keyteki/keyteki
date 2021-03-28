const CardGameAction = require('./CardGameAction');

class RemoveStunAction extends CardGameAction {
    setup() {
        this.name = 'removeStun';
        this.targetType = ['creature'];
        this.effectMsg = 'remove the stun from {0}';
    }

    canAffect(card, context) {
        if (card.location !== 'play area') {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onRemoveStun', { card: card, context: context }, () =>
            card.unstun()
        );
    }
}

module.exports = RemoveStunAction;
