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
        // See note in MostStatCardSelector: tagged-for-destruction cards still
        // count for the stat threshold but are normally excluded from the
        // player's selection. If every threshold-meeting candidate is moribund
        // we fall back to the top `numCards` of the sorted list so downstream
        // effects that reference the chosen target still have one to work
        // with.
        let nonMoribundAtThreshold = sorted.filter(
            (c) => !c.moribund && this.cardStat(c) <= maxStat
        );
        if (nonMoribundAtThreshold.length >= this.numCards) {
            return !card.moribund && this.cardStat(card) <= maxStat && sorted.includes(card);
        }
        return sorted.slice(0, this.numCards).includes(card);
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
        let nonMoribundAtThreshold = sorted.filter(
            (c) => !c.moribund && this.cardStat(c) <= maxStat
        );
        if (nonMoribundAtThreshold.length >= this.numCards) {
            return sorted.every(
                (card) =>
                    card.moribund || this.cardStat(card) >= maxStat || selectedCards.includes(card)
            );
        }
        let fallback = sorted.slice(0, this.numCards);
        return selectedCards.every((card) => fallback.includes(card));
    }
}

module.exports = LeastStatCardSelector;
