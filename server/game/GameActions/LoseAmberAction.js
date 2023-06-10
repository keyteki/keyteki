const PlayerAction = require('./PlayerAction');

class LoseAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'loseAmber';
        this.effectMsg = 'make {0} lose ' + this.amount + ' amber';
    }

    canAffect(player, context) {
        return this.amount && super.canAffect(player, context);
    }

    checkEventCondition(event) {
        return super.checkEventCondition(event) && event.player.amber > 0;
    }

    getEvent(player, context) {
        return super.createEvent(
            'onModifyAmber',
            {
                player: player,
                amount: Math.min(player.amber, this.amount),
                context: context,
                loseAmber: true
            },
            (event) => event.player.modifyAmber(-event.amount)
        );
    }
}

module.exports = LoseAmberAction;
