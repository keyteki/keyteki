const CardGameAction = require('./CardGameAction');

class ReadyAction extends CardGameAction {
    setup() {
        this.name = 'ready';
        this.targetType = ['character', 'attachment', 'stronghold'];
        this.effectMsg = 'ready {0}';
        this.cost = 'readying {0}';
    }

    canAffect(card, context) {
        if((card.location !== 'play area' && !card.isStronghold) || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardReadied', { card: card, context: context }, () => card.ready());
    }
}

module.exports = ReadyAction;
