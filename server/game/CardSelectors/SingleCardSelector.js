const BaseCardSelector = require('./BaseCardSelector.js');

class SingleCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.numCards = 1;
    }

    defaultActivePromptTitle() {
        if(this.cardType.length === 1) {
            if(this.cardType === ['attachment']) {
                return 'Choose an attachment';
            }
            return 'Choose a ' + this.cardType[0];
        }
        return 'Choose a card';
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
