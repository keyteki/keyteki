const BaseCardSelector = require('./BaseCardSelector.js');

class ExactlyXCardSelector extends BaseCardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
    }

    getNumCards(context) {
        if(typeof this.numCards === 'function') {
            return this.numCards(context);
        }
        return this.numCards;
    }

    defaultActivePromptTitle(context) {
        let numCards = this.getNumCards(context);
        if(this.cardType.length === 1) {
            return numCards === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${numCards} ${this.cardType[0]}s`;
        }
        return numCards === 1 ? 'Choose a card' : `Choose ${numCards} cards`;
    }

    hasEnoughSelected(selectedCards, context) {
        return selectedCards.length === this.getNumCards(context);
    }
    /*
    hasEnoughTargets(context) {
        let numMatchingCards = context.game.allCards.reduce((total, card) => {
            if(this.canTarget(card, context)) {
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCards;
    }*/

    hasReachedLimit(selectedCards, context) {
        return selectedCards.length >= this.getNumCards(context);
    }

    automaticFireOnSelect(context) {
        return this.getNumCards(context) === 1;
    }
}

module.exports = ExactlyXCardSelector;
