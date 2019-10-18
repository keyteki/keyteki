const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class MostHouseCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
    }

    canTarget(card, context) {
        return this.getCardsFromMostHouseInPlay(context).includes(card);
    }

    getCardsFromMostHouseInPlay(context) {
        let houseStats = context.game.getHousesStatInPlay({ cardType: 'creature' });

        let mostHouses = [];
        for(let house in houseStats.countMap) {
            if(houseStats.maxCount === houseStats.countMap[house]) {
                mostHouses.push(house);
            }
        }

        return this.findPossibleCards(context).filter(card => super.canTarget(card, context) && mostHouses.some(house => card.hasHouse(house)));
    }

    hasEnoughSelected(selectedCards, context) {
        if(!super.hasEnoughSelected(selectedCards)) {
            return false;
        }
        let allowedCards = this.getCardsFromMostHouseInPlay(context);
        return allowedCards.length <= this.numCards;
    }
}

module.exports = MostHouseCardSelector;
