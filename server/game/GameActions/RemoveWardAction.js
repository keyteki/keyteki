const CardGameAction = require('./CardGameAction');

class RemoveWardAction extends CardGameAction {
    setup() {
        this.name = 'removeWard';
        this.targetType = ['creature'];
        this.effectMsg = 'remove the ward from {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area') {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onRemoveWard', { card: card, context: context }, () => card.unward());
    }
}

module.exports = RemoveWardAction;
