const Card = require('../../Card.js');

class UFO extends Card {
    // Play. Discard cards from the top of your deck until you discard a
    //       Mars card or run out of cards. If you discard a Mars card this way,
    //       put it into your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex((card) => card.hasHouse('mars'));
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find((card) => card.hasHouse('mars'));
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

UFO.id = 'ufo';

module.exports = UFO;
