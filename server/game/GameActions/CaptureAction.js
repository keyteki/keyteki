const CardAction = require('./CardGameAction');

class CaptureAction extends CardAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'capture';
        this.effectMsg = 'capture ' + this.amount + ' amber from {1}, placing it on {0}';
        this.effectArgs = context => context.player.opponent;
    }

    canAffect(card, context) {
        return context.player.opponent && context.player.checkRestrictions('capture', context) &&
               context.player.opponent.amber > 0 && this.amount > 0 && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            context: context,
            card: card,
            amount: Math.min(this.amount, context.player.opponent.amber)
        };
        return super.createEvent('onCapture', params, event => {
            context.player.opponent.modifyAmber(-event.amount);
            event.card.addToken('amber', event.amount);
        });
    }
}

module.exports = CaptureAction;
