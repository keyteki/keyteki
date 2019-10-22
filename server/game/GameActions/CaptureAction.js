const CardAction = require('./CardGameAction');

class CaptureAction extends CardAction {
    setDefaultProperties() {
        this.amount = 1;
        this.ownController = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'capture';
        this.effectMsg = 'capture ' + this.amount + ' amber from {1}, placing it on {0}';
        this.effectArgs = this.target.length > 0 ? this.target[0].controller.opponent : 'their opponent';
        if(this.ownController && this.target.length > 0) {
            this.effectArgs = this.target[0].controller;
        }
    }

    canAffect(card, context) {
        let player = this.ownController ? card.controller : card.controller.opponent;
        return player && player.checkRestrictions('capture', context) &&
               player.amber > 0 && this.amount > 0 && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let player = this.ownController ? card.controller : card.controller.opponent;
        let params = {
            context: context,
            card: card,
            amount: Math.min(this.amount, player.amber)
        };
        return super.createEvent('onCapture', params, event => {
            if(!player.anyEffect('captureFromPool')) {
                player.modifyAmber(-event.amount);
            }

            event.card.addToken('amber', event.amount);
        });
    }
}

module.exports = CaptureAction;
