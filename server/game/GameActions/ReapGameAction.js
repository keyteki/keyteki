const CardGameAction = require('./CardGameAction');

class ReapGameAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.effectMsg = 'reap with {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.exhausted) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onReap', { card: card, context: context }, () => {
            card.exhaust();
            card.controller.modifyAmber(1);
        });
    }
}

module.exports = ReapGameAction;
