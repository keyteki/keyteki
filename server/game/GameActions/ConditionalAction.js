const GameAction = require('./GameAction');

class ConditionalAction extends GameAction {
    setup() {
        super.setup();
        this.effectMsg = 'conditionally do something';
    }

    evaluateGameAction(context) {
        let condition = this.condition;
        if (typeof condition === 'function') {
            condition = condition(context);
        }

        let gameAction = condition ? this.trueGameAction : this.falseGameAction;
        if (gameAction) {
            this.effectMsg = gameAction.effectMsg;
            this.effectArgs = gameAction.effectArgs;
        }

        return gameAction;
    }

    setDefaultTarget(func) {
        if (this.trueGameAction) {
            this.trueGameAction.setDefaultTarget(func);
        }
        if (this.falseGameAction) {
            this.falseGameAction.setDefaultTarget(func);
        }
    }

    setTarget(target) {
        if (this.trueGameAction) {
            this.trueGameAction.setTarget(target);
        }

        if (this.falseGameAction) {
            this.falseGameAction.setTarget(target);
        }
    }

    update(context) {
        super.update(context);

        if (this.trueGameAction) {
            this.trueGameAction.update(context);
        }

        if (this.falseGameAction) {
            this.falseGameAction.update(context);
        }
    }

    hasLegalTarget(context) {
        this.update(context);

        return (
            (this.trueGameAction && this.trueGameAction.hasLegalTarget(context)) ||
            (this.falseGameAction && this.falseGameAction.hasLegalTarget(context))
        );
    }

    canAffect(target, context) {
        return (
            (this.trueGameAction && this.trueGameAction.canAffect(context)) ||
            (this.falseGameAction && this.falseGameAction.canAffect(context))
        );
    }

    getEventArray(context) {
        let gameAction = this.evaluateGameAction(context);
        return gameAction ? gameAction.getEventArray(context) : [];
    }
}

module.exports = ConditionalAction;
