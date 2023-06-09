const SingleCardSelector = require('../CardSelectors/SingleCardSelector');

class CardListSelector extends SingleCardSelector {
    constructor(cardList, revealList = []) {
        super({
            cardType: [...new Set(cardList.map((c) => c.type))]
        });
        this.cardList = cardList;
        this.revealList = revealList && revealList.length > 0 ? revealList : cardList;
    }

    // eslint-disable-next-line no-unused-vars
    findPossibleCards(context) {
        return this.revealList;
    }

    // eslint-disable-next-line no-unused-vars
    canTarget(card, context) {
        if (!card) {
            return false;
        }

        return this.cardList.includes(card);
    }
}

module.exports = CardListSelector;
