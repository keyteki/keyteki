const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.refill = false;
    }

    setup() {
        super.setup();
        this.name = 'draw';
        this.effectMsg = 'draw ' + this.amount + ' cards';
    }

    canAffect(player, context) {
        return (this.amount !== 0 || this.refill) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        let shedChains = false;
        let amount = 0;
        if(this.refill) {
            if(player.maxHandSize > player.hand.length) {
                amount = player.maxHandSize - player.hand.length - (Math.floor((player.chains + 5) / 6));
                shedChains = player.chains > 0;
            }

            if(amount > 0) {
                context.game.addMessage('{0} draws {1} cards up to their maximum hand size of {2}', player, amount, player.maxHandSize);
            }
        } else {
            amount = this.amount;
        }

        return super.createEvent('onDrawCards', {
            player: player,
            amount: amount,
            shedChains: shedChains,
            context: context
        }, event => {
            if(event.amount > 0) {
                event.player.drawCardsToHand(amount);
            }

            if(shedChains) {
                event.player.modifyChains(-1);
                context.game.addMessage('{0}\'s chains are reduced by 1 to {1}', event.player, event.player.chains);
            }
        });
    }
}

module.exports = DrawAction;
