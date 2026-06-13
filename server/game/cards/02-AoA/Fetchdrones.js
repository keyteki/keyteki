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
                    gameAction: ability.actions.allocateCapture((context) => ({
                        amberStep: 2,
                        numSteps: Math.min(
                            cards.filter((card) => card.hasHouse('logos')).length,
                            Math.ceil(
                                (context.player.opponent ? context.player.opponent.amber : 0) / 2
                            )
                        ),
                        controller: 'self',
                        menuTitle: 'Choose a creature to capture 2 amber'
                    }))
                };
            }
        });
    }
}

Fetchdrones.id = 'fetchdrones';

module.exports = Fetchdrones;
