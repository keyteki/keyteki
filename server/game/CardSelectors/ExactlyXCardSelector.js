const _ = require('underscore');
const BaseCardSelector = require('./BaseCardSelector.js');

class ExactlyXCardSelector extends BaseCardSelector {
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
        if (this.cardType.length === 1) {
            return numCards === 1
                ? 'Choose a ' + this.cardType[0]
                : { text: `Choose {{amount}} ${this.cardType[0]}s`, values: { amount: numCards } };
        }

        return numCards === 1
            ? 'Choose a card'
            : { text: 'Choose {{amount}} cards', values: { amount: numCards } };
    }

    hasEnoughDistinctSelected(selectedCards, numCards) {
        return _.uniq(selectedCards.map((card) => card.type)).length === numCards;
    }

    hasEnoughSelected(selectedCards, context) {
        const numCards = this.getNumCards(context);
        return (
            selectedCards.length === numCards &&
            (!this.distinctCardTypes || this.hasEnoughDistinctSelected(selectedCards, numCards))
        );
    }

    hasReachedLimit(selectedCards, context) {
        return selectedCards.length >= this.getNumCards(context);
    }

    hasExceededLimit(selectedCards, context) {
        return selectedCards.length > this.getNumCards(context);
    }

    automaticFireOnSelect(context) {
        return this.getNumCards(context) === 1;
    }
}

module.exports = ExactlyXCardSelector;
