const PlayerAction = require('./PlayerAction');

class ModifyAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.reap = false;
        this.returned = false; // the amber was on an enemy creature
        this.stolen = false;
        this.transferred = false;
        this.bonus = false;
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

    /* In addition to modifying amber values, adds animations when appropriate,
    except for amber gained when the "bonus" option is set to true. */
    getEvent(player, context) {
        let params = {
            player: player,
            amount: this.amount,
            reap: this.reap,
            returned: this.returned,
            stolen: this.stolen,
            transferred: this.transferred,
            bonus: this.bonus,
            target: this.target,
            context: context
        };

        return super.createEvent('onModifyAmber', params, (event) => {
            event.player.modifyAmber(event.amount);
        });
    }
}

module.exports = ModifyAmberAction;
