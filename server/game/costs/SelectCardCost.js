const CardSelector = require('../CardSelector.js');

class SelectCardCost {
    constructor(action, promptProperties) {
        this.action = action;
        this.selector = this.createSelector(action, promptProperties);
        this.activePromptTitle = promptProperties.activePromptTitle;
        this.promptsPlayer = true;
    }

    createSelector(action, properties) {
        let condition = (card, context) => {
            return card.controller === context.player && action.canAffect(card, context) && properties.cardCondition(card, context);
        };

        let fullProperties = Object.assign({}, properties, { cardCondition: condition });

        return CardSelector.for(fullProperties);
    }

    canPay(context) {
        return this.selector.hasEnoughTargets(context);
    }

    resolve(context, result) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: this.activePromptTitle,
            context: context,
            selector: this.selector,
            source: context.source,
            buttons: result.canCancel ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onSelect: (player, cards) => {
                context.costs[this.action.name] = cards;
                this.action.setTarget(cards);
                return true;
            },
            onCancel: () => result.cancelled = true
        });

        return result;
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = SelectCardCost;
