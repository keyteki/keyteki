const Card = require('../../Card.js');

class DarkInfluence extends Card {
    // Play: Discard the top card of a player's deck. If it is a Mutant creature, gain 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's deck",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.discard((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player.deck.slice(0, 1)
                        : context.player.opponent.deck.slice(0, 1)
            })),
            then: {
                condition: (context) =>
                    context.preThenEvents.length > 0 &&
                    context.preThenEvents[0].card &&
                    context.preThenEvents[0].card.type === 'creature' &&
                    context.preThenEvents[0].card.hasTrait('mutant'),
                gameAction: ability.actions.gainAmber({ amount: 1 }),
                message: '{0} uses {1} to gain 1 amber',
                messageArgs: (context) => [context.player, context.source]
            }
        });
    }
}

DarkInfluence.id = 'dark-influence';

module.exports = DarkInfluence;
