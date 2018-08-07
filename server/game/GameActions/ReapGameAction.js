const CardGameAction = require('./CardGameAction');

class ReapGameAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.effectMsg = 'reap with {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onReap', { card: card, context: context }, () => card.controller.modifyAmber);
    }
}

module.exports = ReapGameAction;
