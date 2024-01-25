const GameAction = require('./GameAction');

class ConditionalAction extends GameAction {
    setup() {
        super.setup();
        this.effectMsg = 'conditionally do something';
    }

    setDefaultTarget(func) {
        if (this.trueGameAction) {
            for (let gameAction of this.trueGameAction) {
                gameAction.setDefaultTarget(func);
            }
        }
        if (this.falseGameAction) {
            for (let gameAction of this.falseGameAction) {
                gameAction.setDefaultTarget(func);
            }
        }
    }

    preEventHandler(context) {
        this.update(context);

        let condition = this.condition;
        if (typeof condition === 'function') {
            condition = condition(context);
        }

        let gameAction = condition ? this.trueGameAction : this.falseGameAction;
        if (gameAction) {
            for (let action of gameAction) {
                action.preEventHandler(context);
            }
        }
    }

    setTarget(target) {
        if (this.trueGameAction && !Array.isArray(this.trueGameAction)) {
            this.trueGameAction = [this.trueGameAction];
        }

        if (this.falseGameAction && !Array.isArray(this.falseGameAction)) {
            this.falseGameAction = [this.falseGameAction];
        }

        if (this.trueGameAction) {
            for (let gameAction of this.trueGameAction) {
                gameAction.setTarget(target);
            }
        }

        if (this.falseGameAction) {
            for (let gameAction of this.falseGameAction) {
                gameAction.setTarget(target);
            }
        }
    }

    update(context) {
        super.update(context);

        if (this.trueGameAction) {
            for (let gameAction of this.trueGameAction) {
                gameAction.update(context);
            }
        }

        if (this.falseGameAction) {
            for (let gameAction of this.falseGameAction) {
                gameAction.update(context);
            }
        }
    }

    hasLegalTarget(context) {
        this.update(context);

        return (
            (this.trueGameAction &&
                this.trueGameAction.some((action) => action.hasLegalTarget(context))) ||
            (this.falseGameAction &&
                this.falseGameAction.some((action) => action.hasLegalTarget(context)))
        );
    }

    canAffect(target, context) {
        return (
            (this.trueGameAction &&
                this.trueGameAction.some((action) => action.canAffect(target, context))) ||
            (this.falseGameAction &&
                this.falseGameAction.some((action) => action.canAffect(target, context)))
        );
    }

    getEventArray(context) {
        let condition = this.condition;
        if (typeof condition === 'function') {
            condition = condition(context);
        }

        let gameAction = condition ? this.trueGameAction : this.falseGameAction;

        return gameAction
            ? gameAction.reduce((array, action) => array.concat(action.getEventArray(context)), [])
            : [];
    }
}

module.exports = ConditionalAction;
