const PlayerAction = require('./PlayerAction');

class GainManaAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 5;
        this.refill = true;
    }

    setup() {
        super.setup();
        this.name = 'modifyMana';
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        if(this.refill) {
            context.game.addMessage('{0} refills {1} mana.', player, this.amount);
        }

        let params = {
            player: player,
            amount: this.amount,
            context: context
        };
        return super.createEvent('onModifyMana', params, event => {
            player.mana = Math.max(event.amount, 0);
        });
    }

}

module.exports = GainManaAction;
