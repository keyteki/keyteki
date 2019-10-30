const CardGameAction = require('./CardGameAction');

class CaptureAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.ownController = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'capture';
        this.effectMsg = 'capture ' + this.amount + ' amber from {1}, placing it on {0}';
        this.effectArgs = (context) => {
            let player = context.player.opponent ? context.player.opponent : 'their opponent';
            if(this.ownController && context.target && context.target.length > 0) {
                player = context.target[0].controller;
            }
            return player;
        }
    }

    canAffect(card, context) {
        let player = this.ownController ? card.controller : context.player.opponent;
        return player && player.checkRestrictions('capture', context) &&
               player.amber > 0 && this.amount > 0 && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let player = this.ownController ? card.controller : context.player.opponent;
        let params = {
            player: player,
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
