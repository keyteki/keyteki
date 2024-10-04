const Card = require('../../Card.js');

class BlueAmberdrake extends Card {
    // Destroyed: Gain 4A. Forge your blue key at current cost.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainAmber({ amount: 4 }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey({ keyColor: 'blue' })
            }
        });
    }
}

BlueAmberdrake.id = 'blue-æmberdrake';

module.exports = BlueAmberdrake;
