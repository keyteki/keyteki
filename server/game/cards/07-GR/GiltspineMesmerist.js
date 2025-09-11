const Card = require('../../Card.js');

class GiltspineMesmerist extends Card {
    // After a player readies a card, discard the top card of their deck.
    //
    // Scrap: Discard the top 3 cards of a player's deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardReadied: (event) => event.exhausted
            },
            condition: (context) => context.game.activePlayer.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.game.activePlayer.deck[0]
            }))
        });

        this.scrap({
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
    }
}

GiltspineMesmerist.id = 'giltspine-mesmerist';

module.exports = GiltspineMesmerist;
