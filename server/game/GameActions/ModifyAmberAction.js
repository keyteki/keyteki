const PlayerAction = require('./PlayerAction');

class ModifyAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = this.amount >= 0 ? 'gainAmber' : 'spendAmber';
        this.effectMsg = (this.amount >= 0 ? 'gain ' : 'lose ') + this.amount.toString() + ' amber';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        if(this.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onModifyAmber', { player: player, amount: this.amount, context: context }, () => {
            if(player.anyEffect('redirectAmber')) {
                player.mostRecentEffect('redirectAmber').addToken('amber', this.amount);
            } else {
                player.modifyAmber(this.amount);
            }
        });
    }
}

module.exports = ModifyAmberAction;
