import BaseCardSelector from './BaseCardSelector.js';

class MinStatCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.cardStat = properties.cardStat;
        this.minStat = properties.minStat;
        this.numCards = properties.numCards;
    }

    hasEnoughSelected(selectedCards) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);
        return currentStatSum >= this.minStat();
    }
}

export default MinStatCardSelector;
