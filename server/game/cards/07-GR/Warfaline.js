const Card = require('../../Card.js');

class Warfaline extends Card {
    // Play/After Fight: Shuffle the top 5 cards of a discard pile
    // into their owner’s deck.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                mode: 'select',
                activePromptTitle: "Which player's discard",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            effect: "shuffle the top 5 cards of a discard pile into the owner's deck",
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                shufflePlayer:
                    !context.select || context.select === 'Mine'
                        ? context.player
                        : context.player.opponent,
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player.getDiscardSlice(5)
                        : context.player.opponent.getDiscardSlice(5)
            }))
        });
    }
}

Warfaline.id = 'warfaline';

module.exports = Warfaline;
