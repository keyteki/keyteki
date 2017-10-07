class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.gameAction = properties.gameAction;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    canTarget(card, context) {
        return (
            this.cardType.includes(card.getType()) &&
            this.cardCondition(card, context) &&
            card.allowGameAction(this.gameAction)
        );
    }

    hasEnoughSelected(selectedCards) {
        return selectedCards.length > 0;
    }

    hasEnoughTargets(context) {
        return context.game.allCards.any(card => this.canTarget(card, context));
    }

    defaultActivePromptTitle() {
        return 'Select characters';
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

    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
