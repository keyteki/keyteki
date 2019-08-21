const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.shedChains = false;
    }

    setup() {
        super.setup();
        this.name = 'draw';
        this.effectMsg = 'draw ' + this.amount + ' cards';
    }

    canAffect(player, context) {
        return (this.amount !== 0 || this.shedChains) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onDrawCards', {
            player: player,
            amount: this.amount,
            context: context
        }, () => {
            if(this.amount > 0) {
                player.drawCardsToHand(this.amount);
            }

            if(this.shedChains) {
                if(this.amount >= 0 && player.chains > 0) {
                    player.modifyChains(-1);
                    context.game.addMessage('{0}\'s chains are reduced by 1 to {1}', player, player.chains);
                }
            }
        });
    }
}

module.exports = DrawAction;
