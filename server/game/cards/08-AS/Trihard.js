import Card from '../../Card.js';

class Trihard extends Card {
    // Play: Each player randomly discards one third of their cards
    // from their hand (rounding down).
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discardAtRandom((context) => ({
                    target: context.player,
                    amount: Math.floor(context.player.hand.length / 3)
                })),
                ability.actions.discardAtRandom((context) => ({
                    target: context.player.opponent,
                    amount: context.player.opponent
                        ? Math.floor(context.player.opponent.hand.length / 3)
                        : 0
                }))
            ]
        });
    }
}

Trihard.id = 'trihard';

export default Trihard;
