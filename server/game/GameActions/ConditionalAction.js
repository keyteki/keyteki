const GameAction = require('./GameAction');

class ConditionalAction extends GameAction {
    setup() {
        super.setup();
        this.effectMsg = 'conditionally do something';
    }

    getGameAction(context) {
        if(this.trueGameAction) {
            this.trueGameAction.setDefaultTarget(() => context.target);
        }

        if(this.falseGameAction) {
            this.falseGameAction.setDefaultTarget(() => context.target);
        }

        let condition = this.condition;
        if(typeof(condition) === 'function') {
            condition = condition(context);
        }

        let gameAction = condition ? this.trueGameAction : this.falseGameAction;
        if(gameAction) {
            this.effectMsg = gameAction.effectMsg;
            this.effectArgs = gameAction.effectArgs;
        }

        return gameAction;
    }

    update(context) {
        super.update(context);

        if(this.trueGameAction) {
            this.trueGameAction.update(context);
        }

        if(this.falseGameAction) {
            this.falseGameAction.update(context);
        }
    }

    hasLegalTarget(context) {
        this.update(context);
        if(this.target.length === 0) {
            return false;
        }

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
