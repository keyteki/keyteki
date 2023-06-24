const Card = require('../../Card.js');

class Hallafest extends Card {
    // Play: Search your deck and discard pile for up to 4 Bräkken cards with different names.
    // Reveal those cards and put them into your hand.
    // Shuffle your deck.
    // Gain chains equal to the number of cards put into your hand this way.

    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.search({
                cardCondition: (card) => card.hasTrait('bräkken'),
                amount: 4,
                uniqueCardNames: true
            }),

            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainChains((context) => ({
                    amount:
                        context.preThenEvents && context.preThenEvents.length == 0
                            ? 0
                            : context.preThenEvents[0].searchedCards.length
                }))
            }
        });
    }
}
Hallafest.id = 'hallafest';

module.exports = Hallafest;
