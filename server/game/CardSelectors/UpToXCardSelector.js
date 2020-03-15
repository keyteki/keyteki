const BaseCardSelector = require('./BaseCardSelector.js');

class UpToXCardSelector extends BaseCardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
        this.optional = true;
    }

    getNumCards(context) {
        if(typeof this.numCards === 'function') {
            return this.numCards(context);
        }

        return this.numCards;
    }

    defaultActivePromptTitle(context) {
        let numCards = this.getNumCards(context);
        if(this.cardType.length === 1) {
            return numCards === 1 ? 'Choose a ' + this.cardType[0] : { text: `Choose {{amount}} ${this.cardType[0]}s`, values: { amount: numCards } };
        }

        return numCards === 1 ? 'Choose a card' : { text: 'Choose {{amount}} cards', values: { amount: numCards } };
    }

    hasReachedLimit(selectedCards, context) {
        return selectedCards.length >= this.getNumCards(context);
    }

    hasExceededLimit(selectedCards, context) {
        return selectedCards.length > this.getNumCards(context);
    }

    hasEnoughTargets() {
        return true;
    }
}

module.exports = UpToXCardSelector;
