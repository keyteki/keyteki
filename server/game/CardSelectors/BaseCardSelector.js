class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.gameAction = properties.gameAction;
        this.optional = properties.optional;
        this.stage = properties.stage || 'effect';

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    canTarget(card, context, pretarget = false) {
        if(pretarget && context.ability && !context.ability.canPayCosts(context, card)) {
            return false;
        }
        return (
            this.cardType.includes(card.getType()) &&
            this.cardCondition(card, context) &&
            card.allowGameAction(this.gameAction, context) &&
            card.allowGameAction('target', context)
        );
    }

    hasEnoughSelected(selectedCards) {
        return selectedCards.length > 0;
    }

    hasEnoughTargets(context, pretarget = false) {
        return (this.optional || context.game.allCards.any(card => this.canTarget(card, context, pretarget)));
    }

    defaultActivePromptTitle() {
        return 'Choose cards';
    }

    automaticFireOnSelect() {
        return false;
    }

    wouldExceedLimit(selectedCards, card) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasReachedLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }
    
    hasExceededLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
