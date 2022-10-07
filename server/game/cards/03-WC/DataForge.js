const Card = require('../../Card.js');

class DataForge extends Card {
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
