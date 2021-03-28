const PlayerAction = require('./PlayerAction');

class ModifyChainsAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'modifyChains';
        this.effectMsg = 'increase their chains by ' + this.amount;
    }

    canAffect(player, context) {
        if (this.amount === 0) {
            return false;
        }

        return super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        let params = {
            player: player,
            amount: this.amount,
            context: context
        };
        return super.createEvent('onModifyBid', params, (event) => {
            player.chains = Math.max(player.chains + event.amount, 0);
        });
    }
}

module.exports = ModifyChainsAction;
