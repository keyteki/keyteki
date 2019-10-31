const GameAction = require('./GameAction');

class ConditionalAction extends GameAction {
    setup() {
        super.setup();
        this.effectMsg = 'conditionally do something';
    }

    getGameAction(context) {
        let condition = this.condition;
        if(typeof(condition) === 'function') {
            condition = condition(context);
        }

        return condition ? this.trueGameAction : this.falseGameAction;
    }

    update(context) {
        let gameAction = this.getGameAction(context);
        if(gameAction) {
            gameAction.update(context);
        }
    }

    hasLegalTarget(context) {
        this.update(context);
        let gameAction = this.getGameAction(context);
        return gameAction && gameAction.hasLegalTarget(context);
    }

    canAffect(target, context) {
        let gameAction = this.getGameAction(context);
        return gameAction && gameAction.canAffect(target, context);
    }

    getEventArray(context) {
        let gameAction = this.getGameAction(context);
        return gameAction ? gameAction.getEventArray(context) : [];
    }
}

module.exports = ConditionalAction;
