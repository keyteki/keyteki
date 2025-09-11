const Card = require('../../Card.js');

class EventHorizon extends Card {
    // Play: Discard cards from the top of your deck until you discard
    // an action card or run out of cards. If you discarded an action
    // card, play that card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex((card) => card.getType() === 'action');
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find((card) => card.getType() === 'action');
                if (card) {
                    return {
                        message: '{0} plays {3}',
                        messageArgs: card,
                        gameAction: ability.actions.playCard({
                            target: card
                        })
                    };
                }
            }
        });
    }
}

EventHorizon.id = 'event-horizon';

module.exports = EventHorizon;
