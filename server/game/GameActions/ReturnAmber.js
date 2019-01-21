const CardGameAction = require('./CardGameAction');

class ReturnAmber extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.recipient = null;
        this.all = false;
    }

    setup() {
        this.name = 'removeAmber';
        this.targetType = ['creature'];
        this.effectMsg = 'remove ' + this.all ? 'all' : this.amount + ' amber from {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            amount: this.all ? card.amber : Math.min(this.amount, card.amber),
            recipient: this.recipient || card.controller.opponent
        };
        return super.createEvent('onReturnAmber', params, event => {
            event.card.removeToken('amber');
            context.game.actions.gainAmber({ amount: event.amount }).resolve(context.player, context);
        });
    }
}

module.exports = ReturnAmber;
