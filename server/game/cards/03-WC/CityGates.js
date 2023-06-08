const Card = require('../../Card.js');

class CityGates extends Card {
    // Action: A friendly creature captures 1A. If that creature is a Dinosaur, it captures 2A instead.
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
