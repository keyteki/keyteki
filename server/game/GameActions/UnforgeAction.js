const PlayerAction = require('./PlayerAction');

class UnforgeAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'unforgeKey';
        this.effectMsg = 'unforge an opponent\'s key';
    }

    getEvent(player, context) {
        return super.createEvent('onUnforgeKey', { player, context }, () => player.keys--);
    }
}

module.exports = UnforgeAction;
