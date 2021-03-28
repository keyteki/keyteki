const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class MostStatCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
        this.cardStat = properties.cardStat;
    }

    canTarget(card, context) {
        let sorted = this.getSortedCards(context);
        let minStat = sorted.length < this.numCards ? 0 : this.cardStat(sorted[this.numCards - 1]);
        return this.cardStat(card) >= minStat && sorted.includes(card);
    }

    getSortedCards(context) {
        return this.findPossibleCards(context)
            .filter((card) => super.canTarget(card, context))
            .sort((a, b) => this.cardStat(b) - this.cardStat(a));
    }

    hasEnoughSelected(selectedCards, context) {
        if (!super.hasEnoughSelected(selectedCards)) {
            return false;
        }

        let sorted = this.getSortedCards(context);
        let minStat = sorted.length < this.numCards ? 0 : this.cardStat(sorted[this.numCards - 1]);
        return sorted.every(
            (card) => this.cardStat(card) <= minStat || selectedCards.includes(card)
        );
    }
}

module.exports = MostStatCardSelector;
