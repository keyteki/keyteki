const ThenAbility = require('./ThenAbility');

class CardAbility extends ThenAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.location = properties.location || 'play area';
        this.printedAbility = properties.printedAbility === false ? false : true;

        // When effectStyle is 'all', use sequential execution to interleave messages with events
        if (properties.effectStyle === 'all' && !properties.handler) {
            this.handler = this.executeActionsSequentially;
        }
    }

    // Execute each action sequentially, printing its effectMsg before resolving its events
    executeActionsSequentially(context) {
        const actions = this.getGameActions(context);
        for (const action of actions) {
            action.preEventHandler(context);
        }

        // Track all events across sequential execution for 'then' condition checking
        const allEvents = [];
        this.game.queueSimpleStep(() => this.executeNextAction(actions, context, 0, allEvents));
    }

    executeNextAction(actions, context, index, allEvents) {
        if (index >= actions.length) {
            // All actions processed, handle 'then' abilities
            this.handleThenAbilities(context, actions, allEvents);
            return;
        }

        const action = actions[index];
        const events = action.getEventArray(context);

        // Track events for 'then' condition checking
        allEvents.push(...events);

        // Print effectMsg for this action if it has legal targets
        if (action.hasLegalTarget(context) && action.effectMsg) {
            this.addMessage(
                this.getMessageArgs(context, action.effectMsg, [action.target], action.effectArgs)
            );
        }

        // Open event window for this action's events
        if (events.length > 0) {
            this.game.openEventWindow(events);
        }

        // Queue the next action
        this.game.queueSimpleStep(() =>
            this.executeNextAction(actions, context, index + 1, allEvents)
        );
    }

    handleThenAbilities(context, actions, allEvents) {
        let then = this.properties.then;
        if (then && typeof then === 'function') {
            then = then(context);
        }

        if (then) {
            this.game.queueSimpleStep(() => {
                if (then.alwaysTriggers || allEvents.every((event) => !event.cancelled)) {
                    const ThenAbility = require('./ThenAbility');
                    let thenAbility = new ThenAbility(this.game, this.card, then);
                    let thenContext = thenAbility.createContext(context.player);
                    thenContext.preThenEvents = allEvents;
                    thenContext.preThenEvent = allEvents[0];
                    if (
                        !thenAbility.meetsRequirements(thenContext, []) &&
                        thenAbility.condition(thenContext)
                    ) {
                        this.game.resolveAbility(thenContext);
                    }
                }
            });
        }

        for (let action of actions) {
            if (action.postHandler) {
                action.postHandler(context, action);
            }
        }

        this.game.queueSimpleStep(() => this.game.checkGameState());
    }

    isInValidLocation(context) {
        return this.card.type === 'event'
            ? context.player.isCardInPlayableLocation(context.source, 'play')
            : this.location.includes(this.card.location);
    }

    meetsRequirements(context, ignoredRequirements) {
        if (!this.card.checkRestrictions('triggerAbilities', context)) {
            return 'cannotTrigger';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    addMessage(messageArgs) {
        let message = '';
        for (let i = 0; i < messageArgs.length; ++i) {
            message += `{${i}}`;
        }

        if (this.properties.effectAlert) {
            this.game.addAlert('bell', message, ...messageArgs);
        } else {
            this.game.addMessage(message, ...messageArgs);
        }
    }

    getMessageArgs(
        context,
        effectMessage = null,
        effectArgs = [],
        extraArgs = null,
        previousMessageArgs = null,
        last = false
    ) {
        let messageArgs = previousMessageArgs || [
            context.player,
            context.source.type === 'event' ? ' plays ' : ' uses ',
            context.source
        ];

        // effectMessage: Player1 plays Assassination
        if (effectMessage) {
            if (extraArgs) {
                if (typeof extraArgs === 'function') {
                    extraArgs = extraArgs(context);
                }

                effectArgs = effectArgs.concat(extraArgs);
            }

            // to
            if (messageArgs.indexOf(' to ') === -1) {
                messageArgs.push(' to ');
            } else {
                // appending a message
                messageArgs.push(last ? '; and ' : '; ');
            }

            // discard Stoic Gunso
            messageArgs.push({
                message: this.game.gameChat.getFormattedMessage(effectMessage, ...effectArgs)
            });
        }

        return messageArgs;
    }

    displayMessage(context) {
        if (this.properties.preferActionPromptMessage) {
            return;
        }

        if (this.properties.message) {
            this.displayCustomMessage(context);
            return;
        }

        if (this.properties.effect) {
            this.displayEffectMessage(context);
            return;
        }

        // effectStyle: 'all' prints messages during sequential execution, not here
        if (this.properties.effectStyle === 'all') {
            return;
        }

        this.displayGameActionMessage(context);
    }

    displayCustomMessage(context) {
        let messageArgs = this.properties.messageArgs;
        if (typeof messageArgs === 'function') {
            messageArgs = messageArgs(context);
        }

        if (!Array.isArray(messageArgs)) {
            messageArgs = [messageArgs];
        }

        if (this.properties.effectAlert) {
            this.game.addAlert('bell', this.properties.message, ...messageArgs);
        } else {
            this.game.addMessage(this.properties.message, ...messageArgs);
        }
    }

    displayEffectMessage(context) {
        this.addMessage(
            this.getMessageArgs(
                context,
                this.properties.effect,
                [context.target || context.source],
                this.properties.effectArgs
            )
        );
    }

    displayGameActionMessage(context) {
        const gameActions = this.getGameActions(context).filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );

        if (!gameActions || gameActions.length === 0) {
            this.addMessage(this.getMessageArgs(context));
            return;
        }

        let messageArgs = this.getMessageArgs(
            context,
            gameActions[0].effectMsg,
            [gameActions[0].target],
            gameActions[0].effectArgs
        );

        if (this.properties.effectStyle === 'append') {
            for (let i = 1; i < gameActions.length; ++i) {
                const gameAction = gameActions[i];
                messageArgs = this.getMessageArgs(
                    context,
                    gameAction.effectMsg,
                    [gameAction.target],
                    gameAction.effectArgs,
                    messageArgs,
                    i === gameActions.length - 1
                );
            }
        }

        this.addMessage(messageArgs);
    }

    isPlay() {
        return false;
    }

    isReap() {
        return false;
    }

    isFight() {
        return false;
    }

    isTriggeredAbility() {
        return true;
    }
}

module.exports = CardAbility;
