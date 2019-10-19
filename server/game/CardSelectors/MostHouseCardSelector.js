const ExactlyXCardSelector = require('./ExactlyXCardSelector');

class MostHouseCardSelector extends ExactlyXCardSelector {
    constructor(properties) {
        super(properties.numCards, properties);
    }

    canTarget(card, context) {
        return this.getCardsFromMostHouseInPlay(context).includes(card);
    }

    getCardsFromMostHouseInPlay(context) {
        let possibleCards = this.findPossibleCards(context);
        if(possibleCards.length === 0) {
            return [];
        }

        let houseStats = context.game.getHousesStatInPlay({ cardType: 'creature' });
        let mostHouseCount = -1;
        houseStats.forEach(entry => {
            if(mostHouseCount < entry[1]) {
                mostHouseCount = entry[1];
            }
        });

        let mostHouses = [];
        houseStats.forEach(entry => {
            if(entry[1] === mostHouseCount) {
                mostHouses.push(entry[0]);
            }
        });

        return possibleCards.filter(card => super.canTarget(card, context) && mostHouses.some(house => card.hasHouse(house)));
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
