const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class RemoveFateAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.recipient = null;
    }

    setup() {
        this.name = 'removeFate';
        this.targetType = ['character'];
        this.effectMsg = 'remove ' + this.amount + ' fate from {0}';
        this.cost = 'removing ' + this.amount + ' fate from {0}';
    }

    checkRecipient(context) {
        if(!this.recipient || ['player, ring'].includes(this.recipient.type)) {
            return true;
        }
        return this.recipient.allowGameAction('placeFate', context);
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.fate === 0 || card.type !== 'character' || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.origin, event.context);
    }

    getEvent(card, context) {
        return new MoveFateEvent({ context: context }, this.amount, card, this.recipient, this);
    }
}

module.exports = RemoveFateAction;
