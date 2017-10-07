const BaseCardSelector = require('./BaseCardSelector.js');

class SingleCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.numCards = 1;
    }

    defaultActivePromptTitle() {
        return 'Select a character';
    }

    automaticFireOnSelect() {
        return true;
    }

    hasReachedLimit(selectedCards) {
        return selectedCards.length >= this.numCards;
    }

    formatSelectParam(cards) {
        return cards[0];
    }
}

module.exports = SingleCardSelector;
