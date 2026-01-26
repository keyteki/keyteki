const Card = require('../../Card.js');

class Trihard extends Card {
    // Play: Each player randomly discards one third of their cards
    // from their hand (rounding down).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: [context.player, context.player.opponent].filter((p) => p),
                amount: (player) => Math.floor(player.hand.length / 3)
            }))
        });
    }
}

Trihard.id = 'trihard';

module.exports = Trihard;
