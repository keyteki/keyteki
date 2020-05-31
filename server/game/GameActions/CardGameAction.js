const GameAction = require('./GameAction');
const CardSelector = require('../CardSelector');

class CardGameAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.promptForSelect = null;
        this.promptWithHandlerMenu = null;
        this.promptWithOptionsMenu = null;
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
            context.game.promptForSelect(properties.player, properties);
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
                        context.game.addMessage(
                            properties.message,
                            properties.player,
                            context.source,
                            card
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
            event.card.checkRestrictions(this.name, event.context)
        );
    }
}

module.exports = CardGameAction;
