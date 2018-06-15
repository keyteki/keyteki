const CardGameAction = require('./CardGameAction');

class BowAction extends CardGameAction {
    setup() {
        this.name = 'bow';
        this.targetType = ['character', 'attachment', 'stronghold'];
        this.effectMsg = 'bow {0}';
        this.cost = 'bowing {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' && card.type !== 'stronghold' || card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardBowed', { card: card, context: context }, () => card.bow());
    }
}

module.exports = BowAction;
