const Card = require('../../Card.js');

class CityGates extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture((context) => ({
                    amount:
                        context.target && context.target.getTraits().includes('dinosaur') ? 2 : 1
                }))
            }
        });
    }
}

CityGates.id = 'city-gates';

module.exports = CityGates;
