const Card = require('../../Card.js');

class GrislyExchange extends Card {
    // Play: Put the top 5 cards of your opponent's discard pile on
    // the bottom of their deck. Discard the top 5 cards of your deck.
    setupCardAbilities(ability) {
        this.play({
            effect:
                "put the top 5 cards of {2}'s discard pile on the bottom of their deck, and discard the top 5 cards of {1}'s deck",
            effectArgs: (context) => [context.player, context.player.opponent],
            gameAction: [
                ability.actions.conditional((context) => ({
                    condition:
                        context.player.opponent && context.player.opponent.discard.length > 0,
                    trueGameAction: ability.actions.returnToDeck({
                        bottom: true,
                        target: context.player.opponent
                            ? context.player.opponent.discard.slice(
                                  0,
                                  Math.min(5, context.player.opponent.discard.length)
                              )
                            : []
                    })
                })),
                ability.actions.discard((context) => ({
                    target: context.player.deck.slice(0, Math.min(5, context.player.deck.length))
                }))
            ]
        });
    }
}

GrislyExchange.id = 'grisly-exchange';

module.exports = GrislyExchange;
