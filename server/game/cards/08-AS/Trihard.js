const Card = require('../../Card.js');

class Trihard extends Card {
    // Play: Each player randomly discards one third of their cards
    // from their hand (rounding down).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom((context) => ({
                amount: (player) => Math.floor(player.hand.length / 3),
                target: [context.player, context.player.opponent]
            }))
        });
    }
}

Trihard.id = 'trihard';

module.exports = Trihard;
