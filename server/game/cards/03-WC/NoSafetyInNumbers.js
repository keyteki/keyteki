const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class NoSafetyInNumbers extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => {
                let countMap = {};
                Constants.Houses.forEach(
                    (house) =>
                        (countMap[house] = context.game.creaturesInPlay.filter((card) =>
                            card.hasHouse(house)
                        ).length)
                );
                return {
                    amount: 3,
                    target: context.game.creaturesInPlay.filter((card) =>
                        Object.entries(countMap).some(
                            (entry) => entry[1] > 2 && card.hasHouse(entry[0])
                        )
                    )
                };
            })
        });
    }
}

NoSafetyInNumbers.id = 'no-safety-in-numbers';

module.exports = NoSafetyInNumbers;
