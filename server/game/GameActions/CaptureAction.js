const { EVENTS } = require('../Events/types');
const CardAction = require('./CardGameAction');

class CaptureAction extends CardAction {
    setDefaultProperties() {
        this.amount = 1;
        this.player = false;
        this.allowNoAmber = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'capture';
        this.effectMsg = 'capture ' + this.amount + ' amber from {1}, placing it on {0}';
        this.effectArgs = 'their opponent';
        if (this.player && this.target.length > 0) {
            this.effectArgs = this.player;
        }
    }

    canAffect(card, context) {
        let player = this.player || context.player.opponent;
        return (
            player &&
            player.checkRestrictions('capture', context) &&
            (player.amber > 0 || this.allowNoAmber) &&
            this.amount > 0 &&
            card.location === 'play area' &&
            super.canAffect(card, context)
        );
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        context.game.queueSimpleStep(() => {
            if (this.target.length > 1) {
                let player = this.player || context.player.opponent;
                if (player.amber < this.target.length * this.amount) {
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Not enough amber, choose creatures',
                        mode: 'exactly',
                        numCards: Math.ceil(player.amber / this.amount),
                        context: context,
                        cardCondition: (card) => this.target.includes(card),
                        onSelect: (player, cards) => {
                            this.target = cards;
                            return true;
                        }
                    });
                }
            }
        });
    }

    getEvent(card, context) {
        let player = this.player || context.player.opponent;
        let params = {
            context: context,
            card: card,
            amount: Math.min(this.amount, player.amber)
        };
        return super.createEvent(EVENTS.onCapture, params, (event) => {
            let amount = event.amount;
            if (!player.anyEffect('captureFromPool')) {
                if (amount > player.amber) {
                    amount = player.amber;
                }
                player.modifyAmber(-amount);
            }

            event.card.addToken('amber', amount);
        });
    }
}

module.exports = CaptureAction;
