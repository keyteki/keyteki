const CardGameAction = require('./CardGameAction');

class ReturnAmber extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.recipient = null;
    }

    setup() {
        this.name = 'removeAmber';
        this.targetType = ['creature'];
        this.effectMsg = 'remove ' + this.amount + ' fate from {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.amber === 0 || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            amount: Math.min(this.amount, card.amber),
            recipient: this.recipient || card.controller.opponent
        };
        return super.createEvent('onReturnAmber', params, event => {
            event.card.modifyAmber(-event.amount);
            event.recipient.modifyAmber(event.amount);
        });
    }
}

module.exports = ReturnAmber;
