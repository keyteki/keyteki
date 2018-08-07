const PlayerAction = require('./PlayerAction');

class CaptureAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.creature = null;
    }

    setup() {
        super.setup();
        this.name = 'capture';
        this.effectMsg = 'capture ' + this.amount + ' amber from {0}, placing it on {1}';
        this.effectArgs = () => this.creature;
    }

    update(context) {
        let defaults = {
            target: this.getDefaultTargets(context),
            creature: context.source
        };
        this.applyProperties(Object.assign(defaults, this.propertyFactory(context)));
    }

    canAffect(player, context) {
        return player.amber > 0 && this.amount > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let params = {
            context: context,
            player: player,
            amount: Math.max(this.amount, player.amber),
            creature: this.creature || context.source
        };
        return super.createEvent('onCapture', params, event => {
            event.player.modifyAmber(-event.amount);
            event.creature.modifyAmber(event.amount);
        });
    }
}

module.exports = CaptureAction;
