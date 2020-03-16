const PlayerAction = require('./PlayerAction');

class GainManaAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 5;
        this.refill = true;
    }

    setup() {
        super.setup();
        this.name = 'modifyMana';
        this.effectMsg = 'refills their mana by ' + this.amount;
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
        return super.createEvent('onModifyMana', params, event => {
            player.mana = Math.max(player.chains + event.amount, 0);
        });
    }

}

module.exports = GainManaAction;
