const Card = require('../../Card.js');

class DataForge extends Card {
    setupCardAbilities(ability) {
        this.play({
            may: 'forge a key',
            alwaysTriggers: true,
            gameAction: ability.actions.forgeKey((context) => ({
                modifier: 10 - context.player.hand.length
            }))
        });
    }
}

DataForge.id = 'data-forge';

module.exports = DataForge;
