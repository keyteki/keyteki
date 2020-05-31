const PlayerAction = require('./PlayerAction');

class ShuffleDeckAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'shuffleDeck';
        this.effectMsg = 'shuffle their deck';
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player, context: context }, (event) => {
            event.player.shuffleDeck();
            context.game.addMessage('{0} is shuffling their deck', player);
        });
    }
}

module.exports = ShuffleDeckAction;
