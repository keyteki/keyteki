const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.refill = false;
        this.bonus = false;
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
        if (this.refill) {
            if (player.maxHandSize > player.hand.length) {
                amount =
                    player.maxHandSize - player.hand.length - Math.floor((player.chains + 5) / 6);
                shedChains = player.chains > 0;
            }
        } else {
            amount = this.amount;
        }

        if (!this.bonus && amount > 0) {
            context.game.addMessage(
                '{0} draws {1} card{2}{3}',
                player,
                amount,
                amount > 1 ? 's' : '',
                this.refill ? ` to their maximum of ${player.maxHandSize}` : ''
            );
        }

        return super.createEvent(
            'onDrawCards',
            {
                player: player,
                amount: amount,
                bonus: this.bonus,
                shedChains: shedChains,
                context: context
            },
            (event) => {
                if (event.amount > 0) {
                    event.player.drawCardsToHand(amount);
                }

                if (shedChains) {
                    event.player.modifyChains(-1);
                    context.game.addMessage(
                        "{0}'s chains are reduced by 1 to {1}",
                        event.player,
                        event.player.chains
                    );
                }
            }
        );
    }
}

module.exports = DrawAction;
