const PlayerAction = require('./PlayerAction');

class RaiseTideAction extends PlayerAction {
    setDefaultProperties() {
        this.chainCost = 0;
    }

    setup() {
        super.setup();
        this.name = 'raiseTide';
        this.effectMsg = 'raise the tide';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return (
            player.checkRestrictions('raiseTide', context) &&
            !player.isTideHigh() &&
            super.canAffect(player, context)
        );
    }

    getEvent(player, context) {
        let raiseTideEvent = super.createEvent(
            'onRaiseTide',
            { player: player, context: context },
            () => {
                context.game.raiseTide(player);
            }
        );

        if (this.chainCost > 0) {
            raiseTideEvent.addChildEvent(
                context.game.actions
                    .gainChains({
                        amount: this.chainCost
                    })
                    .getEvent(player, context)
            );
        }

        return raiseTideEvent;
    }
}

module.exports = RaiseTideAction;
