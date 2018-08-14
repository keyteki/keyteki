const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class ExactlyStatCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
        this.cardStat = properties.cardStat;
    }

    canTarget(card, context) {
        let sorted = this.findPossibleCards(context).filter(card => super.canTarget(card, context)).sortBy(card => this.cardStat(card));
        let minStat = sorted.length < this.numCards ? 0 : this.cardStat(sorted[this.numCards - 1]);
        return this.cardStat(card) >= minStat && sorted.includes(card);
    }
}

module.exports = ExactlyStatCardSelector;
