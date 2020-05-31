const Constants = require('../../constants.js');
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
        if (possibleCards.length === 0) {
            return [];
        }

        let countMap = {};
        Constants.Houses.forEach(
            (house) =>
                (countMap[house] = context.game.creaturesInPlay.filter((card) =>
                    card.hasHouse(house)
                ).length)
        );
        let houseStats = Object.entries(countMap);

        let mostHouseCount = -1;
        houseStats.forEach((entry) => {
            if (mostHouseCount < entry[1]) {
                mostHouseCount = entry[1];
            }
        });

        return possibleCards.filter(
            (card) =>
                super.canTarget(card, context) &&
                houseStats.some((entry) => entry[1] === mostHouseCount && card.hasHouse(entry[0]))
        );
    }

    hasEnoughSelected(selectedCards, context) {
        if (!super.hasEnoughSelected(selectedCards)) {
            return false;
        }

        let allowedCards = this.getCardsFromMostHouseInPlay(context);
        return allowedCards.length <= this.numCards;
    }
}

module.exports = MostHouseCardSelector;
