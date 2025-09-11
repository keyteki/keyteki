const Card = require('../../Card.js');

class YellowAmberdrake extends Card {
    // Destroyed: Gain 4A. Forge your yellow key at current cost.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainAmber({ amount: 4 }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey({ keyColor: 'yellow' })
            }
        });
    }
}

YellowAmberdrake.id = 'yellow-æmberdrake';

module.exports = YellowAmberdrake;
