const Card = require('../../Card.js');

class Lethologica extends Card {
    // Play: Discard cards from the top of your deck until you discard a Logos card or run out of cards. If you discard a Logos card this way, put it into your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex((card) => card.hasHouse('logos'));
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find((card) => card.hasHouse('logos'));
                if (card) {
                    return {
                        message: '{0} takes {3} into their hand',
                        messageArgs: card,
                        gameAction: ability.actions.returnToHand({
                            target: card,
                            location: 'discard'
                        })
                    };
                }
            }
        });
    }
}

Lethologica.id = 'lethologica';

module.exports = Lethologica;
