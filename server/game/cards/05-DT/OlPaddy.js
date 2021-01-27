const Card = require('../../Card.js');

class OlPaddy extends Card {
    // Reap: Discard the bottom card of your deck, or the bottom 3 cards instead if the tide is high.
    // Play each creature discarded this way, one at a time.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(context.player.isTideHigh() ? -3 : -1)
            })),
            then: {
                gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                    forEach: context.preThenEvents.filter((event) => event.card.type === 'creature')
                }))
            }
        });
    }
}

OlPaddy.id = 'ol--paddy';

module.exports = OlPaddy;
