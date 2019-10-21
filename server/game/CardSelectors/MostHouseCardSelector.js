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
        let max = -1;
        let houseMap = Constants.Houses.reduce((map, house) => {
            for(let creature of context.game.creaturesInPlay) {
                if(creature.hasHouse(house)) {
                    map[house] = ++map[house] || 1;
                    if(map[house] > max) {
                        max = map[house];
                    }
                }
            }

            return map;
        }, {});

        let mostHouses = [];
        for(let house in houseMap) {
            if(max === houseMap[house]) {
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
