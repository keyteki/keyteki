const PlayerAction = require('./PlayerAction');

class NeutralizeTideAction extends PlayerAction {
    setDefaultProperties() {
        this.chainCost = 0;
    }

    setup() {
        super.setup();
        this.name = 'neutralizeTide';
        this.effectMsg = 'neutralize the tide';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onNeutralizeTide', { player: player, context: context }, () => {
            context.game.changeTide(player, null);
        });
    }
}

module.exports = NeutralizeTideAction;
