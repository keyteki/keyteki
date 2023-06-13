const Card = require('../../Card.js');

class CityStateInterest extends Card {
    // Play: Each friendly creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.player.creaturesInPlay
            })),
            effect: 'make each friendly creature capture 1 amber'
        });
    }
}

CityStateInterest.id = 'city-state-interest';

module.exports = CityStateInterest;
