import PlayerAction from './PlayerAction.js';

class UnforgeAction extends PlayerAction {
    setDefaultProperties() {
        this.choices = null;
    }

    setup() {
        super.setup();
        this.name = 'unforgeKey';
        this.effectMsg = "unforge an opponent's key";
    }

    checkEventCondition(event) {
        return Object.keys(event.player.keys).length > 0 && super.checkEventCondition(event);
    }

    getEvent(player, context) {
        return super.createEvent('onUnforgeKey', { player, choices: this.choices, context }, () =>
            player.unforgeKey(this.choices)
        );
    }
}

export default UnforgeAction;
