const Card = require('../../Card.js');

class DataForge extends Card {
    // Play: You may forge a key at +10 current cost, reduced by 1 for each card in your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                may: true,
                modifier: 10 - context.player.hand.length
            }))
        });
    }
}

DataForge.id = 'data-forge';

module.exports = DataForge;
