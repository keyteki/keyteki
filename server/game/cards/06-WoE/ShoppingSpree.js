const Card = require('../../Card.js');

class ShoppingSpree extends Card {
    // Play: Discard your hand. Draw a card for each card discarded
    // this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardEntireLocation((context) => ({
                location: 'hand',
                target: context.player
            })),
            then: {
                gameAction: ability.actions.draw((context) => ({
                    amount: context.preThenCards.length
                }))
            }
        });
    }
}

ShoppingSpree.id = 'shopping-spree';

module.exports = ShoppingSpree;
