const PlayerAction = require('./PlayerAction');

class UnforgeAction extends PlayerAction {
    setDefaultProperties() {
        this.choices = [];
    }

    setup() {
        super.setup();
        this.name = 'unforgeKey';
        this.effectMsg = "unforge an opponent's key";
    }

    getEvent(player, context) {
        return super.createEvent('onUnforgeKey', { player, choices: this.choices, context }, () =>
            player.unforgeKey(this.choices)
        );
    }
}

module.exports = UnforgeAction;
