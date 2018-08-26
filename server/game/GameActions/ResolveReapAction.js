const CardGameAction = require('./CardGameAction');

class ResolveReapAction extends CardGameAction {
    setup() {
        this.name = 'reap';
        this.targetType = ['creature'];
        this.effectMsg = 'reap with {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !card.checkRestrictions('reap')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onReap', { card: card, context: context }, () => {
            card.controller.modifyAmber(1);
        });
    }
}

module.exports = ResolveReapAction;
