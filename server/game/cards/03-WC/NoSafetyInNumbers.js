const Card = require('../../Card.js');

class NoSafetyInNumbers extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage(context => {
                let filteredHouses = context.game.getHousesStatInPlay({ cardType: 'creature' }).filter(entry => entry[1] > 2);
                return { amount: 3, target: context.game.creaturesInPlay.filter(card => filteredHouses.some(entry => card.hasHouse(entry[0]))) };
            })
        });
    }
}

NoSafetyInNumbers.id = 'no-safety-in-numbers';

module.exports = NoSafetyInNumbers;
