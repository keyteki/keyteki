const Card = require('../../Card.js');

class PrognosticatingWitch extends Card {
    // Play/After Reap: If you have 3 or fewer cards in your hand, draw 2 cards.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            condition: (context) => context.player.hand.length <= 3,
            gameAction: ability.actions.draw({ amount: 2 }),
            effect: 'draw 2 cards'
        });
    }
}

PrognosticatingWitch.id = 'prognosticating-witch';

module.exports = PrognosticatingWitch;
