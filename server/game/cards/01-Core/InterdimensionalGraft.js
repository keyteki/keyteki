const Card = require('../../Card.js');

class InterdimensionalGraft extends Card {
    // Play: If an opponent forges a key on their next turn, they must give you their remaining A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            effect: 'take any remaining amber from {1} if they forge a key next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect((context) => ({
                when: {
                    onForgeKey: (event) => event.player === context.player.opponent
                },
                gameAction: ability.actions.transferAmber((context) => ({
                    target: context.event.player,
                    amount: context.event.player.amber
                }))
            }))
        });
    }
}

InterdimensionalGraft.id = 'interdimensional-graft';

module.exports = InterdimensionalGraft;
