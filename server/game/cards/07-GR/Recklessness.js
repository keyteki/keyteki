const Card = require('../../Card.js');

class Recklessness extends Card {
    // Play: Each player discards 3 random cards from their hand, then
    // draws 3 cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.discardAtRandom((context) => ({
                    target: [context.player, context.player.opponent],
                    amount: 3
                })),
                ability.actions.draw((context) => ({
                    target: [context.player, context.player.opponent],
                    amount: 3
                }))
            ])
        });
    }
}

Recklessness.id = 'recklessness';

module.exports = Recklessness;
