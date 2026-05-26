const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class MostStatCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
        this.cardStat = properties.cardStat;
    }

    canTarget(card, context) {
        let sorted = this.getSortedCards(context);
        let minStat = sorted.length < this.numCards ? 0 : this.cardStat(sorted[this.numCards - 1]);
        // Cards already tagged for destruction set the stat ceiling (so e.g.
        // "destroy the most powerful enemy creature" still knows the tagged
        // card is the most powerful) but normally cannot themselves be chosen:
        // the destroy event would no-op and clicking an already-dying card is
        // a degenerate prompt. We exclude moribund cards as long as enough
        // non-moribund cards meet the threshold. If every threshold-meeting
        // candidate is moribund, fall back to the top `numCards` of the sorted
        // list (including moribund) so downstream effects referencing the
        // chosen target still resolve.
        let nonMoribundAtThreshold = sorted.filter(
            (c) => !c.moribund && this.cardStat(c) >= minStat
        );
        if (nonMoribundAtThreshold.length >= this.numCards) {
            return !card.moribund && this.cardStat(card) >= minStat && sorted.includes(card);
        }
        return sorted.slice(0, this.numCards).includes(card);
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
        let nonMoribundAtThreshold = sorted.filter(
            (c) => !c.moribund && this.cardStat(c) >= minStat
        );
        if (nonMoribundAtThreshold.length >= this.numCards) {
            return sorted.every(
                (card) =>
                    card.moribund || this.cardStat(card) <= minStat || selectedCards.includes(card)
            );
        }
        let fallback = sorted.slice(0, this.numCards);
        return selectedCards.every((card) => fallback.includes(card));
    }
}

module.exports = MostStatCardSelector;
