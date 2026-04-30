const Card = require('../../Card.js');

class AshwingProtocol extends Card {
    // Play: If you are overwhelmed, draw 3 cards.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.isOverwhelmed(),
            gameAction: ability.actions.draw({ amount: 3 }),
            effect: 'draw 3 cards'
        });
    }
}

AshwingProtocol.id = 'ashwing-protocol';

module.exports = AshwingProtocol;
