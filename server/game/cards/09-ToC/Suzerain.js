const Card = require('../../Card.js');

class Suzerain extends Card {
    // After Reap: Purge the top card of a player’s deck. If you do,
    // make a Minion.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's deck",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.purge((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player.deck.slice(0, 1)
                        : context.player.opponent.deck.slice(0, 1)
            })),
            then: {
                condition: (context) => context.player.tokenCard.name === 'Minion',
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a Minion'
            }
        });
    }
}

Suzerain.id = 'suzerain';

module.exports = Suzerain;
