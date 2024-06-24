const PlayerAction = require('./PlayerAction');

class ModifyAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.reap = false;
    }

    setup() {
        super.setup();
        this.name = this.amount >= 0 ? 'gainAmber' : 'spendAmber';
        this.effectMsg = (this.amount >= 0 ? 'gain ' : 'lose ') + this.amount.toString() + ' amber';
    }

    canAffect(player, context) {
        return this.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        let params = { player: player, amount: this.amount, reap: this.reap, context: context };

        return super.createEvent('onModifyAmber', params, (event) => {
            event.player.modifyAmber(event.amount);
        });
    }
}

module.exports = ModifyAmberAction;
