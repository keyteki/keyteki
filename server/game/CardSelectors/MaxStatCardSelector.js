const BaseCardSelector = require('./BaseCardSelector.js');

class MaxStatCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
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
        return currentStatSum >= this.maxStat();
    }
    
    hasExceededLimit(selectedCards) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);
        return currentStatSum > this.maxStat();
    }
}

module.exports = MaxStatCardSelector;
