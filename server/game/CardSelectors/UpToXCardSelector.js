const BaseCardSelector = require('./BaseCardSelector.js');

class UpToXCardSelector extends BaseCardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
        this.optional = true;
    }

    defaultActivePromptTitle() {
        return this.numCards === 1 ? 'Select a character' : { text: 'Select {{amount}} characters', values: { amount: this.numCards } };
    }

    hasReachedLimit(selectedCards) {
        return selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards) {
        return selectedCards.length > this.numCards;
    }

    hasEnoughTargets() {
        return true;
    }
}

module.exports = UpToXCardSelector;
