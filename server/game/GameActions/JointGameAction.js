const GameAction = require('./GameAction');

class JointGameAction extends GameAction {
    constructor(gameActions) {
        super({ gameActions: gameActions });
        this.gameActions = gameActions;
    }

    setup() {
        super.setup();
        this.effectMsg = 'do several things';
    }

    update(context) {
        for (const gameAction of this.gameActions) {
            gameAction.update(context);
        }
    }

    setDefaultTarget(func) {
        for (const gameAction of this.gameActions) {
            gameAction.setDefaultTarget(func);
        }
    }

    setTarget(target) {
        for (const gameAction of this.gameActions) {
            gameAction.setTarget(target);
        }
    }

    preEventHandler(context) {
        for (const gameAction of this.gameActions) {
            gameAction.preEventHandler(context);
        }
    }

    hasLegalTarget(context) {
        return this.gameActions.every((gameAction) => gameAction.hasLegalTarget(context));
    }

    canAffect(target, context) {
        return this.gameActions.every((gameAction) => gameAction.canAffect(target, context));
    }

    getEventArray(context) {
        return this.gameActions.reduce(
            (array, action) => array.concat(action.getEventArray(context)),
            []
        );
    }
}

module.exports = JointGameAction;
