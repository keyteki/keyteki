const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class LeastStatCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
        this.cardStat = properties.cardStat;
    }

    canTarget(card, context) {
        let sorted = this.getSortedCards(context);
        let maxStat =
            sorted.length < this.numCards ? Infinity : this.cardStat(sorted[this.numCards - 1]);
        // See note in MostStatCardSelector: tagged-for-destruction cards still count for the
        // stat threshold but cannot themselves be chosen by the player.
        return !card.moribund && this.cardStat(card) <= maxStat && sorted.includes(card);
    }

    getSortedCards(context) {
        return this.findPossibleCards(context)
            .filter((card) => super.canTarget(card, context))
            .sort((a, b) => this.cardStat(a) - this.cardStat(b));
    }

    hasEnoughSelected(selectedCards, context) {
        if (!super.hasEnoughSelected(selectedCards)) {
            return false;
        }

        let sorted = this.getSortedCards(context);
        let maxStat =
            sorted.length < this.numCards ? Infinity : this.cardStat(sorted[this.numCards - 1]);
        return sorted.every(
            (card) =>
                card.moribund || this.cardStat(card) >= maxStat || selectedCards.includes(card)
        );
    }
}

module.exports = LeastStatCardSelector;
