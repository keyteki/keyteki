const AbilityContext = require('./AbilityContext.js');
const BaseAbility = require('./baseability.js');

class ThenAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.properties = properties;
        this.condition = properties.condition || (() => true);
        this.alwaysTriggers = properties.alwaysTriggers;
        this.handler = properties.handler || this.executeGameActionPrehandlers;
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: player,
            source: this.card
        });
    }

    checkThenAbilities() {
        return this.properties.then && this.properties.then.alwaysTriggers;
    }

    displayMessage(context) {
        if (this.properties.message) {
            let messageArgs = [context.player, context.source, context.target];
            if (this.properties.messageArgs) {
                let args = this.properties.messageArgs;
                if (typeof args === 'function') {
                    args = args(context);
                }

                messageArgs = messageArgs.concat(args);
            }

            this.game.addMessage(this.properties.message, ...messageArgs);
        }
    }

    getGameActions(context) {
        // if there are any targets, look for gameActions attached to them
        let actions = this.targets.reduce(
            (array, target) => array.concat(target.getGameAction(context)),
            []
        );
        // look for a gameAction on the ability itself, on an upgrade execute that action on its parent, otherwise on the card itself
        return actions.concat(this.gameAction);
    }

    executeHandler(context) {
        if (this.properties.may) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Do you wish to ' + this.properties.may + '?',
                context: context,
                choices: ['Yes', 'No'],
                handlers: [() => this.handler(context), () => true]
            });
        } else {
            this.handler(context);
        }

        this.game.queueSimpleStep(() => this.game.checkGameState());
    }

    executeGameActionPrehandlers(context) {
        let actions = this.getGameActions(context);
        for (const action of actions) {
            action.preEventHandler(context);
        }

        this.game.queueSimpleStep(() => this.executeGameActions(actions, context));
    }

    executeGameActions(actions, context) {
        // Get any gameActions for this ability
        // Get their events, and execute simultaneously
        let events = actions.reduce(
            (array, action) => array.concat(action.getEventArray(context)),
            []
        );
        let then = this.properties.then;
        if (then && typeof then === 'function') {
            then = then(context);
        }

        if (events.length > 0) {
            this.game.openEventWindow(events);
            if (then) {
                this.game.queueSimpleStep(() => {
                    if (then.alwaysTriggers || events.every((event) => !event.cancelled)) {
                        let thenAbility = new ThenAbility(this.game, this.card, then);
                        let thenContext = thenAbility.createContext(context.player);
                        thenContext.preThenEvents = events;
                        thenContext.preThenEvent = events[0];
                        if (
                            !thenAbility.meetsRequirements(thenContext) &&
                            thenAbility.condition(thenContext)
                        ) {
                            this.game.resolveAbility(thenContext);
                        }
                    }
                });
            }
        } else if (then && then.alwaysTriggers) {
            let thenAbility = new ThenAbility(this.game, this.card, then);
            let thenContext = thenAbility.createContext(context.player);
            if (!thenAbility.meetsRequirements(thenContext) && thenAbility.condition(thenContext)) {
                this.game.resolveAbility(thenContext);
            }
        }

        for (let action of actions) {
            if (action.postHandler) {
                action.postHandler(context, action);
            }
        }
    }

    isCardAbility() {
        return true;
    }
}

module.exports = ThenAbility;
