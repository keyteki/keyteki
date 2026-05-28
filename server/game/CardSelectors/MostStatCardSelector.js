const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class MostStatCardSelector extends ExactlyXCardSelector {
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

    // Determines the minimum stat value a card must have to be a valid
    // selection for "choose the creature(s) with the most X". The threshold
    // is the stat of the Nth-highest card (where N = numCards). All non-
    // moribund cards at or above that value are selectable. If fewer than
    // numCards non-moribund cards meet the threshold (e.g. ties were removed
    // by concurrent destruction), isFallback is set and callers fall back to
    // a positional slice of the sorted list that includes moribund cards,
    // ensuring the selector still returns a non-empty target set.
    computeThreshold(context) {
        const sorted = this.getSortedCards(context);
        const threshold =
            sorted.length < this.numCards ? 0 : this.cardStat(sorted[this.numCards - 1]);
        const selectableCards = sorted.filter((c) => !c.moribund && this.cardStat(c) >= threshold);
        const isFallback = selectableCards.length < this.numCards;
        return { sorted, threshold, selectableCards, isFallback };
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

        const { sorted, threshold, isFallback } = this.computeThreshold(context);
        if (isFallback) {
            return selectedCards.every((card) => sorted.slice(0, this.numCards).includes(card));
        }
        return sorted.every(
            (card) =>
                card.moribund || this.cardStat(card) <= threshold || selectedCards.includes(card)
        );
    }
}

module.exports = MostStatCardSelector;
