const CardAction = require('./CardGameAction');

class CaptureAction extends CardAction {
    setDefaultProperties() {
        this.amount = 1;
        this.amountForCard = null;
        this.ownController = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'capture';
        this.effectMsg = `capture ${!this.amountForCard ? this.amount + ' ' : ''}amber from {1}, placing it on {0}`;
        this.effectArgs = this.target.length > 0 ? this.target[0].controller.opponent : 'their opponent';
        if(this.ownController && this.target.length > 0) {
            this.effectArgs = this.target[0].controller;
        }
    }

    getAmount(card, context) {
        return this.amountForCard ? this.amountForCard(card, context) : this.amount;
    }

    canAffect(card, context) {
        let player = this.ownController ? card.controller : card.controller.opponent;
        return player && player.checkRestrictions('capture', context) &&
               player.amber > 0 && this.getAmount(card, context) > 0 && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let player = this.ownController ? card.controller : card.controller.opponent;
        let params = {
            context: context,
            player: player,
            card: card,
            amount: Math.min(this.getAmount(card, context), player.amber)
        };
        return super.createEvent('onCapture', params, event => {
            if(!event.player.anyEffect('captureFromPool')) {
                event.player.modifyAmber(-event.amount);
            }

            event.card.addToken('amber', event.amount);
        });
    }
}

module.exports = CaptureAction;
