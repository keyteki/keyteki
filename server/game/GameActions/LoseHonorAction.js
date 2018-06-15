const PlayerAction = require('./PlayerAction');

class LoseHonorAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'loseHonor';
        this.effectMsg = 'make {0} lose ' + this.amount + ' honor';
        this.cost = 'losing ' + this.amount + ' honor';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onModifyHonor', { player: player, amount: -this.amount, context: context }, event => player.modifyHonor(event.amount));
    }
}

module.exports = LoseHonorAction;
