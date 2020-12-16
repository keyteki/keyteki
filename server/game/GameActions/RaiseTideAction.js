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

    getEvent(player, context) {
        let raiseTideEvent = super.createEvent(
            'onRaiseTide',
            { player: player, context: context },
            () => {
                context.game.changeTide(player, 'high');
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
