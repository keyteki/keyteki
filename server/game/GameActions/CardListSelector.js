const SingleCardSelector = require('../CardSelectors/SingleCardSelector');

class CardListSelector extends SingleCardSelector {
    constructor(cardList, revealList = []) {
        super({
            cardType: [...new Set(cardList.map((c) => c.type))]
        });
        this.cardList = cardList;
        this.revealList = revealList && revealList.length > 0 ? revealList : cardList;
    }

    findPossibleCards(context) {
        return this.revealList;
    }

    canTarget(card, context) {
        if (!card) {
            return false;
        }

        return this.cardList.includes(card);
    }
}

module.exports = CardListSelector;
