const PlayerAction = require('./PlayerAction');

class LoseAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'loseAmber';
        this.effectMsg = 'make {0} lose ' + this.amount + ' honor';
    }

    canAffect(player, context) {
        return this.amount && player.amber && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onModifyHonor', { player: player, amount: this.amount, context: context }, event => player.modifyAmber(-event.amount));
    }
}

module.exports = LoseAmberAction;
