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
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    !context.select || context.select === 'Mine'
                        ? context.player.discard.length > 0
                        : context.player.opponent.discard.length > 0,
                trueGameAction: ability.actions.returnToDeck({
                    shuffle: true,
                    target:
                        !context.select || context.select === 'Mine'
                            ? context.player.discard.slice(
                                  0,
                                  Math.min(5, context.player.discard.length)
                              )
                            : context.player.opponent.discard.slice(
                                  0,
                                  Math.min(5, context.player.opponent.discard.length)
                              )
                })
            }))
        });
    }
}

Warfaline.id = 'warfaline';

module.exports = Warfaline;
