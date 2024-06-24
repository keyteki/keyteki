const PlayerAction = require('./PlayerAction');

class StealAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'steal';
        this.effectMsg = 'steal ' + this.amount + ' amber from {0}';
    }

    canAffect(player, context) {
        return (
            player.opponent &&
            player.amber > 0 &&
            this.amount > 0 &&
            super.canAffect(player, context)
        );
    }

    getEvent(player, context) {
        let params = {
            context: context,
            player: player,
            amount: Math.min(this.amount, player.amber)
        };
        return super.createEvent('onStealAmber', params, (event) => {
            if (!event.player.anyEffect('stealFromPool')) {
                event.player.modifyAmber(-event.amount);
            }

            context.game.actions
                .gainAmber({ amount: event.amount })
                .resolve(event.player.opponent, context);
        });
    }
}

module.exports = StealAction;
