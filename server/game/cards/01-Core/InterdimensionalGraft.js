const Card = require('../../Card.js');

class InterdimensionalGraft extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'take any remaining amber from {1} if they forge a key next turn',
            gameAction: ability.actions.lastingEffect(context => ({
                effect: ability.effects.delayedEffect({
                    when: {
                        onForgeKey: event => event.player === context.player.opponent
                    },
                    gameAction: ability.actions.steal(context => ({ amount: context.player.opponent.amber }))
                })
            }))
        });
    }
}

InterdimensionalGraft.id = 'interdimensional-graft'; // This is a guess at what the id might be - please check it!!!

module.exports = InterdimensionalGraft;
