const BaseCardSelector = require('./BaseCardSelector.js');

class MaxStatCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
        this.numCards = properties.numCards;
    }

    canTarget(card, context) {
        return super.canTarget(card, context) && this.cardStat(card) <= this.maxStat();
    }

    wouldExceedLimit(selectedCards, card) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);

        return this.cardStat(card) + currentStatSum > this.maxStat();
    }

    hasReachedLimit(selectedCards) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);
        return currentStatSum >= this.maxStat() || (this.numCards > 0 && selectedCards.length >= this.numCards);
    }

    hasExceededLimit(selectedCards) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);
        return currentStatSum > this.maxStat() || (this.numCards > 0 && selectedCards.length > this.numCards);
    }
}

module.exports = MaxStatCardSelector;
