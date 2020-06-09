const PlayerAction = require('./PlayerAction');

class MulliganAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'mulligan';
        this.effectMsg = 'take a mulligan';
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player, context: context }, (event) => {
            context.game.addMessage('{0} mulligans their hand', this);
            event.player.takeMulligan();
        });
    }
}

module.exports = MulliganAction;
