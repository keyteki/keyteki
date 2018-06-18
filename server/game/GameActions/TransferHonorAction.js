const PlayerAction = require('./PlayerAction');

class TransferHonorAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.afterBid = false;
    }

    setup() {
        super.setup();
        this.name = 'takeHonor';
        this.effectMsg = 'take ' + this.amount + ' honor from {0}';
        this.cost = 'giving ' + this.amount + ' honor to their opponent';
    }

    canAffect(player, context) {
        return player.opponent && this.amount > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let params = {
            context: context,
            player: player,
            amount: this.amount,
            afterBid: this.afterBid
        };
        return super.createEvent('onTransferHonor', params, event => {
            event.player.modifyHonor(-event.amount);
            event.player.opponent.modifyHonor(event.amount);
        });
    }
}

module.exports = TransferHonorAction;
