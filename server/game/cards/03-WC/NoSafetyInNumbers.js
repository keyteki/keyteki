const Card = require('../../Card.js');

class NoSafetyInNumbers extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage(context => {
                let countMap = context.game.getHousesStatInPlay({ cardType: 'creature' }).countMap;

                let filteredHouses = [];
                for(let house in countMap) {
                    if(countMap[house] > 2) {
                        filteredHouses.push(house);
                    }
                }

                let cards = [];
                if(filteredHouses.length > 0) {
                    cards = context.game.creaturesInPlay.filter(card => filteredHouses.some(house => card.hasHouse(house)));
                }

                return { amount: 3, target: cards };
            })
        });
    }
}

NoSafetyInNumbers.id = 'no-safety-in-numbers';

module.exports = NoSafetyInNumbers;
