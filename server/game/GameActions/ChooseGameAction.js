const GameAction = require('./GameAction');

class ChooseGameAction extends GameAction {
    constructor(choices) {
        super();
        this.choices = choices;
        for(const key of Object.keys(choices)) {
            if(!Array.isArray(choices[key])) {
                this.choices[key] = [choices[key]];
            }
        }
        this.gameActions = Object.values(choices).reduce((array, actions) => array.concat(actions), []);
    }

    setup() {
        super.setup();
        this.effectMsg = 'do several things';
    }

    update(context) {
        for(let gameAction of this.gameActions) {
            gameAction.update(context);
        }
    }

    setTarget(target, context) {
        for(let gameAction of this.gameActions) {
            gameAction.setTarget(target, context);
        }
    }

    preEventHandler(context) {
        let choices = Object.keys(this.choices);
        let handlers = choices.map(choice => {
            return () => {
                this.choice = choice;
                for(let gameAction of this.choices[choice]) {
                    context.game.queueSimpleStep(() => gameAction.preEventHandler(context));
                }
            };
        });
        context.game.promptWithHandlerMenu(context.player, {choices, handlers});
    }

    hasLegalTarget(context) {
        return this.gameActions.some(gameAction => gameAction.hasLegalTarget(context));
    }

    canAffect(target, context) {
        return this.gameActions.some(gameAction => gameAction.canAffect(target, context));
    }

    getEventArray(context) {
        if(!this.choice) {
            return [];
        }
        return this.choices[this.choice].reduce((array, action) => array.concat(action.getEventArray(context)), []);
    }
}

module.exports = ChooseGameAction;
