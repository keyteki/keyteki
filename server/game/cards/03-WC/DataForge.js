const Card = require('../../Card.js');

class DataForge extends Card {
    // Play: You may forge a key at +10 current cost, reduced by 1 for each card in your hand.
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
