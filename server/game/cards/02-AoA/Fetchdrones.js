const Card = require('../../Card.js');

class Fetchdrones extends Card {
    // Action: Discard the top 2 cards of your deck. For each Logos card discarded this way, a friendly creature captures 2A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.player.deck.length > 0
                        ? context.player.deck.slice(0, Math.min(2, context.player.deck.length))
                        : []
            })),
            then: (preThenContext) => {
                let cards =
                    preThenContext.player.deck.length > 0
                        ? preThenContext.player.deck.slice(
                              0,
                              Math.min(2, preThenContext.player.deck.length)
                          )
                        : [];
                return {
                    condition: () => cards.filter((card) => card.hasHouse('logos')).length > 0,
                    gameAction: ability.actions.sequentialForEach({
                        num: cards.filter((card) => card.hasHouse('logos')).length,
                        action: ability.actions.capture((context) => ({
                            amount: 2,
                            promptForSelect: {
                                activePromptTitle: 'Choose a creature',
                                cardType: 'creature',
                                controller: 'self',
                                message: '{0} uses {1} to capture {2} amber onto {3}',
                                messageArgs: (card) => [
                                    context.player,
                                    context.source,
                                    Math.min(2, context.player.opponent?.amber || 0),
                                    card
                                ]
                            }
                        }))
                    })
                };
            }
        });
    }
}

Fetchdrones.id = 'fetchdrones';

module.exports = Fetchdrones;
