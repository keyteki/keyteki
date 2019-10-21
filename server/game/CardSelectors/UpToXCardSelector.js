const BaseCardSelector = require('./BaseCardSelector.js');

class UpToXCardSelector extends BaseCardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
        this.optional = true;
    }

    defaultActivePromptTitle() {
        if(this.cardType.length === 1) {
            return this.numCards === 1 ? 'Choose a ' + this.cardType[0] : { text: `Choose up to {{amount}} ${this.cardType[0]}s`, values: { amount: this.numCards } };
        }

        return this.numCards === 1 ? 'Choose a card' : { text: 'Choose up to {{amount}} cards', values: { amount: this.numCards } };
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
