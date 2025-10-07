import BaseCardSelector from './BaseCardSelector.js';

class XorMoreCardSelector extends BaseCardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
    }

    getNumCards(context) {
        if (typeof this.numCards === 'function') {
            return this.numCards(context);
        }

        return this.numCards;
    }

    defaultActivePromptTitle(context) {
        let numCards = this.getNumCards(context);
        return {
            text: `Choose {{amount}} or more ${this.cardType[0]}s`,
            values: { amount: numCards }
        };
    }

    hasEnoughSelected(selectedCards, context) {
        return selectedCards.length >= this.getNumCards(context);
    }

    hasReachedLimit() {
        return false;
    }

    automaticFireOnSelect() {
        return false;
    }
}

export default XorMoreCardSelector;
