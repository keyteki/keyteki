const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class LeastStatCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
        this.cardStat = properties.cardStat;
    }

    canTarget(card, context) {
        const { sorted, selectableCards, isFallback } = this.computeThreshold(context);
        return isFallback
            ? sorted.slice(0, this.numCards).includes(card)
            : selectableCards.includes(card);
    }

    computeThreshold(context) {
        const sorted = this.getSortedCards(context);
        const threshold =
            sorted.length < this.numCards ? Infinity : this.cardStat(sorted[this.numCards - 1]);
        const selectableCards = sorted.filter((c) => !c.moribund && this.cardStat(c) <= threshold);
        const isFallback = selectableCards.length < this.numCards;
        return { sorted, threshold, selectableCards, isFallback };
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

        const { sorted, threshold, isFallback } = this.computeThreshold(context);
        if (isFallback) {
            return selectedCards.every((card) => sorted.slice(0, this.numCards).includes(card));
        }
        return sorted.every(
            (card) =>
                card.moribund || this.cardStat(card) >= threshold || selectedCards.includes(card)
        );
    }
}

module.exports = LeastStatCardSelector;
