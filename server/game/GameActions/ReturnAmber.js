const CardGameAction = require('./CardGameAction');

class ReturnAmber extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.recipient = null;
    }

    setup() {
        this.name = 'removeAmber';
        this.targetType = ['creature'];
        this.effectMsg = 'remove ' + this.amount + ' amber from {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !card.hasToken('amber') || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            amount: Math.min(this.amount, card.tokens.amber),
            recipient: this.recipient || card.controller.opponent
        };
        return super.createEvent('onReturnAmber', params, event => {
            event.card.removeToken('amber');
            context.game.actions.gainAmber({ amount: event.amount }).resolve(context.player, context);
        });
    }
}

module.exports = ReturnAmber;
