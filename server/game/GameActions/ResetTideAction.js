const Constants = require('../../constants');
const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class ResetTideAction extends PlayerAction {
    setDefaultProperties() {
        this.chainCost = 0;
    }

    setup() {
        super.setup();
        this.name = 'resetTide';
        this.effectMsg = 'reset the tide';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(EVENTS.onResetTide, { player: player, context: context }, () => {
            context.game.changeTide(player, Constants.Tide.NEUTRAL);
        });
    }
}

module.exports = ResetTideAction;
