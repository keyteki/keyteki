const CardGameAction = require('./CardGameAction');

class ReturnAmberAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.recipient = null;
        this.all = false;
    }

    setup() {
        this.name = 'removeAmber';
        this.targetType = ['creature'];
        this.effectMsg = `return ${this.all ? 'all' : this.amount} amber from {0} to ${
            this.recipient ? this.recipient.name + "'s" : 'their'
        } pool`;
    }

    canAffect(card, context) {
        if (card.location !== 'play area' || this.amount === 0) {
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
        return super.createEvent('onReturnAmber', params, (event) => {
            event.card.removeToken('amber', event.amount);
            context.game.actions
                .gainAmber({
                    amount: event.amount,
                    target: this.recipient || card.controller.opponent
                })
                .resolve(context.player, context);
        });
    }
}

module.exports = ReturnAmberAction;
