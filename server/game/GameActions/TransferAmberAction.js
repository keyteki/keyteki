const PlayerAction = require('./PlayerAction');

class TransferAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'transfer';
        this.effectMsg = 'transfer ' + this.amount + ' amber from {0}';
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
        return super.createEvent('onTransferAmber', params, (event) => {
            event.player.modifyAmber(-event.amount);
            context.game.actions
                .gainAmber({ amount: event.amount })
                .resolve(event.player.opponent, context);
        });
    }
}

module.exports = TransferAmberAction;
