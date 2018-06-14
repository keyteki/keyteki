const GameAction = require('./GameAction');
const CardSelector = require('../CardSelector');

class CardGameAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.promptForSelect = null;
        this.promptWithHandlerMenu = null;
    }
    
    setup() {
        this.targetType = ['character', 'attachment', 'holding', 'event', 'stronghold', 'province', 'role'];
    }

    hasLegalTarget(context) {
        let result = super.hasLegalTarget(context);
        if(this.promptForSelect) {
            return this.getSelector().hasEnoughTargets(context);
        } else if(this.promptWithHandlerMenu) {
            return this.promptWithHandlerMenu.cards.some(card => this.canAffect(card, context));
        }
        return result;
    }

    getSelector() {
        let condition = this.promptForSelect.cardCondition || (() => true);
        let cardCondition = (card, context) => this.canAffect(card, context) && condition(card, context);
        return CardSelector.for(Object.assign({}, this.promptForSelect, { cardCondition: cardCondition }));
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if(this.promptForSelect) {
            let selector = this.getSelector();
            if(!selector.hasEnoughTargets(context)) {
                this.target = [];
                return;
            }
            let defaultProperties = {
                player: context.player,
                context: context,
                selector: selector,
                onSelect: (player, cards) => {
                    this.setTarget(cards, context);
                    if(this.promptForSelect.message) {
                        context.game.addMessage(this.promptForSelect.message, player, context.source, cards);
                    }
                    return true;
                }
            };
            let properties = Object.assign(defaultProperties, this.promptForSelect);
            context.game.promptForSelect(properties.player, properties);
        } else if(this.promptWithHandlerMenu) {
            let properties = this.promptWithHandlerMenu;
            properties.cards = properties.cards.filter(card => this.canAffect(card, context));
            if(properties.cards.length === 0) {
                this.target = [];
                return;
            }
            if(!properties.player) {
                properties.player = context.player;
            }
            let defaultProperties = {
                context: context,
                cardHandler: card => {
                    this.setTarget(card, context);
                    if(properties.message) {
                        context.game.addMessage(properties.message, properties.player, context.source, card);
                    }
                }
            };
            context.game.promptWithHandlerMenu(properties.player, Object.assign(defaultProperties, properties));
        }
    }

    defaultTargets(context) {
        return context.source;
    }

    checkEventCondition(event) {
        return this.canAffect(event.card, event.context);
    }
}

module.exports = CardGameAction;
