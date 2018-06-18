const PlayerAction = require('./PlayerAction');

class ModifyFateAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = this.amount >= 0 ? 'gainFate' : 'spendFate';
        this.effectMsg = 'gain ' + this.amount + ' fate';
        this.cost = 'paying ' + this.amount + ' fate';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        if(this.amount === 0 || player.fate < -this.amount) {
            return false;
        }
        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onModifyFate', { player: player, amount: this.amount, context: context }, () => player.modifyFate(this.amount));
    }
}

module.exports = ModifyFateAction;
