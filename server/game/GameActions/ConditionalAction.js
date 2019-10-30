const GameAction = require('./GameAction');

class ConditionalAction extends GameAction {
    setup() {
        super.setup();
        this.effectMsg = this.message || 'conditionally do something';
        this.effectArgs = this.messageArgs;
    }

    getGameAction(context) {
        let condition = this.condition;
        if(typeof(condition) === 'function') {
            condition = condition(context);
        }

        return condition ? this.trueGameAction : this.falseGameAction;
    }

    update(context) {
        let getGameAction = this.getGameAction(context);
        if(getGameAction) {
            getGameAction.update(context);
        }
    }

    hasLegalTarget(context) {
        this.update(context);
        let getGameAction = this.getGameAction(context);
        return getGameAction && getGameAction.hasLegalTarget(context);
    }

    canAffect(target, context) {
        let getGameAction = this.getGameAction(context);
        return getGameAction && getGameAction.canAffect(target, context);
    }

    getEventArray(context) {
        let getGameAction = this.getGameAction(context);
        return getGameAction ? getGameAction.getEventArray(context) : [];
    }
}

module.exports = ConditionalAction;
