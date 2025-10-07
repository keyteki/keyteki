import Card from '../../Card.js';

class Immersioneer extends Card {
    // After Reap: Discard the top 3 cards of any player's deck.
    //
    // Scrap: Shuffle the bottom 3 cards of your discard into your deck.
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
            effect: "discard the top 3 cards of {1}'s deck",
            effectArgs: (context) => [
                !context.select || context.select === 'Mine'
                    ? context.player
                    : context.player.opponent
            ],
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    !context.select || context.select === 'Mine'
                        ? context.player.deck.length > 0
                        : context.player.opponent.deck.length > 0,
                trueGameAction: ability.actions.discard({
                    target:
                        !context.select || context.select === 'Mine'
                            ? context.player.deck.slice(0, Math.min(3, context.player.deck.length))
                            : context.player.opponent.deck.slice(
                                  0,
                                  Math.min(3, context.player.opponent.deck.length)
                              )
                })
            }))
        });

        this.scrap({
            condition: (context) => context.player.discard.length > 0,
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: context.player.getDiscardSlice(-3)
            }))
        });
    }
}

Immersioneer.id = 'immersioneer';

export default Immersioneer;
