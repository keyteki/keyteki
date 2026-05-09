const GameAction = require('./GameAction');
const CardSelector = require('../CardSelector');

class CardGameAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.promptForSelect = null;
        this.promptWithHandlerMenu = null;
    }

    setup() {
        this.targetType = ['creature', 'action', 'artifact', 'upgrade'];
    }

    hasLegalTarget(context) {
        let result = super.hasLegalTarget(context);
        let contextCopy = context.copy();
        contextCopy.stage = 'effect';
        if (this.promptForSelect) {
            return this.getSelector().hasEnoughTargets(contextCopy);
        } else if (this.promptWithHandlerMenu && !this.promptWithHandlerMenu.customHandler) {
            return this.promptWithHandlerMenu.cards.some((card) =>
                this.canAffect(card, contextCopy)
            );
        }

        // If no legal targets but we could get targets when other actions are in the same window, allow it for simultaneous ability ordering
        if (!result && this.targetsCanChangeViaSimultaneousAction(context)) {
            return true;
        }

        return result;
    }

    getSelector() {
        let condition = this.promptForSelect.cardCondition || (() => true);
        let cardCondition = (card, context) =>
            this.canAffect(card, context) && condition(card, context);

        return CardSelector.for(
            Object.assign({}, this.promptForSelect, { cardCondition: cardCondition })
        );
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if (this.promptForSelect) {
            let selector = this.getSelector();
            this.target = [];
            if (!selector.hasEnoughTargets(context)) {
                return;
            }

            let defaultProperties = {
                player: context.player,
                context: context,
                selector: selector,
                onSelect: (player, cards) => {
                    this.setTarget(cards);
                    if (this.promptForSelect.message) {
                        let messageArgs = this.promptForSelect.messageArgs || [];
                        if (typeof messageArgs === 'function') {
                            messageArgs = messageArgs(cards);
                        }

                        if (!Array.isArray(messageArgs)) {
                            messageArgs = [messageArgs];
                        }

                        context.game.addMessage(this.promptForSelect.message, ...messageArgs);
                    }

                    return true;
                }
            };
            let properties = Object.assign(defaultProperties, this.promptForSelect);
            context.game.promptForSelect(context.game.activePlayer, properties);
        } else if (this.promptWithHandlerMenu) {
            let properties = this.promptWithHandlerMenu;
            if (!properties.customHandler) {
                properties.cards = properties.cards.filter((card) => this.canAffect(card, context));
                this.target = [];
            }

            if (properties.cards.length === 0) {
                return;
            }

            if (!properties.player) {
                properties.player = context.player;
            }

            if (properties.customHandler) {
                properties.cardHandler = (card) => properties.customHandler(card, this);
            }

            let defaultProperties = {
                context: context,
                cardHandler: (card) => {
                    this.setTarget(card);
                    if (properties.message) {
                        let messageArgs = properties.messageArgs || [];
                        if (typeof messageArgs === 'function') {
                            messageArgs = messageArgs(card);
                        }

                        if (!Array.isArray(messageArgs)) {
                            messageArgs = [messageArgs];
                        }

                        context.game.addMessage(
                            properties.message,
                            properties.player,
                            context.source,
                            card,
                            ...messageArgs
                        );
                    }
                }
            };
            context.game.promptWithHandlerMenu(
                properties.player,
                Object.assign(defaultProperties, properties)
            );
        }
    }

    defaultTargets(context) {
        return context.source;
    }

    checkEventCondition(event) {
        return (
            this.canAffect(event.card, event.context) &&
            event.card.checkRestrictions(this.name, event.context, event)
        );
    }

    isBlockedWithoutReveal(card, context, playActions) {
        // True only when a card-independent player-level restriction
        // (e.g. Ember Imp's per-turn play limit) blocks the play. Such a
        // block is determined without inspecting the card, so the card
        // can fizzle without being revealed. Card-specific restrictions
        // (those carrying a condition predicate that inspects the card)
        // require the card to be revealed before the block can be known.
        playActions =
            playActions ||
            card.getActions(card.location).filter((action) => action.title.includes('Play'));
        if (playActions.length === 0) {
            return false;
        }
        const actionContext = playActions[0].createContext(context.player);
        actionContext.ignoreHouse = true;
        if (actionContext.player.checkRestrictions('play', actionContext)) {
            return false;
        }
        return context.player.effects.some((effect) => {
            if (effect.type !== 'abilityRestrictions') {
                return false;
            }
            const restriction = effect.getValue && effect.getValue(context.player);
            return (
                restriction &&
                !restriction.condition &&
                restriction.checkRestriction('play', actionContext, null, effect.context)
            );
        });
    }

    // eslint-disable-next-line no-unused-vars
    targetsCanChangeViaSimultaneousAction(context) {
        return false;
    }
}

module.exports = CardGameAction;
