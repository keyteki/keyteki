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
        // "destroy the most powerful enemy creature" knows the tagged card is
        // the most powerful) but cannot themselves be chosen by the player.
        // The destroy event for the tagged card would no-op anyway; excluding
        // it from selectable targets prevents a degenerate "click the card
        // that's already dying" prompt.
        //
        // Trade-off: when the *only* card meeting the threshold is moribund
        // (e.g. it is the sole highest-power creature), `hasEnoughTargets`
        // returns false and the ability silently fizzles instead of
        // "targeting" the tagged card. This produces an identical game state
        // because destroy on a moribund card is a no-op; the only difference
        // is a missing log line.
        return !card.moribund && this.cardStat(card) >= minStat && sorted.includes(card);
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
            (card) =>
                card.moribund || this.cardStat(card) <= minStat || selectedCards.includes(card)
        );
    }
}

module.exports = MostStatCardSelector;
