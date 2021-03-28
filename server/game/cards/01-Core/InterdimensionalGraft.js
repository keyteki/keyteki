const Card = require('../../Card.js');

class InterdimensionalGraft extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            effect: 'take any remaining amber from {1} if they forge a key next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect((context) => ({
                when: {
                    onForgeKey: (event) => event.player === context.player.opponent
                },
                gameAction: ability.actions.transferAmber((context) => ({
                    amount: context.player.opponent.amber
                }))
            }))
        });
    }
}

InterdimensionalGraft.id = 'interdimensional-graft';

module.exports = InterdimensionalGraft;
