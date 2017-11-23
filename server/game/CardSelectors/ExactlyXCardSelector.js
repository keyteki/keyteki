const BaseCardSelector = require('./BaseCardSelector.js');

class ExactlyXCardSelector extends BaseCardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
    }

    defaultActivePromptTitle() {
        if(this.cardType.length === 1) {
            return this.numCards === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${this.numCards} ${this.cardType[0]}`;
        }
        return this.numCards === 1 ? 'Select a card' : `Select ${this.numCards} cards`;
    }

    hasEnoughSelected(selectedCards) {
        return selectedCards.length === this.numCards;
    }

    hasEnoughTargets(context, pretarget = false) {
        let numMatchingCards = context.game.allCards.reduce((total, card) => {
            if(this.canTarget(card, context, pretarget)) {
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCards;
    }

    hasReachedLimit(selectedCards) {
        return selectedCards.length >= this.numCards;
    }
}

module.exports = ExactlyXCardSelector;
