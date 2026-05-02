const Card = require('../../Card.js');

class DeepBlueBryn extends Card {
    // After Fight: Steal 1. If a blue key is forged, ward Deep Blue Bryn.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal({ amount: 1 }),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.game.isKeyForged('blue'),
                gameAction: ability.actions.ward((context) => ({
                    target: context.source
                }))
            })
        });
    }
}

DeepBlueBryn.id = 'deep-blue-bryn';

module.exports = DeepBlueBryn;
