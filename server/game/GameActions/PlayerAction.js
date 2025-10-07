import GameAction from './GameAction.js';

class PlayerAction extends GameAction {
    setup() {
        this.targetType = ['player'];
    }

    defaultTargets(context) {
        return context.player.opponent;
    }

    checkEventCondition(event) {
        return (
            this.canAffect(event.player, event.context) &&
            event.player.checkRestrictions(this.name, event.context)
        );
    }
}

export default PlayerAction;
