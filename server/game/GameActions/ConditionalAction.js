const GameAction = require('./GameAction');

class ConditionalAction extends GameAction {
    setup() {
        super.setup();
        this.effectMsg = 'conditionally do something';
    }

    getAction(context) {
        let condition = this.condition;
        if(typeof(condition) === 'function') {
            condition = condition(context);
        }

        return condition ? this.trueAction : this.falseAction;
    }

    update(context) {
        let action = this.getAction(context);
        if(action) {
            this.effectMsg = action.message || this.effectMsg;
            this.effectArgs = action.messageArgs || this.effectArgs;

            action.gameAction.update(context);
        }
    }

    hasLegalTarget(context) {
        this.update(context);
        let action = this.getAction(context);
        return action && action.gameAction.hasLegalTarget(context);
    }

    canAffect(target, context) {
        let action = this.getAction(context);
        return action && action.gameAction.canAffect(target, context);
    }

    getEventArray(context) {
        let action = this.getAction(context);
        return action ? action.gameAction.getEventArray(context) : [];
    }
}

module.exports = ConditionalAction;
