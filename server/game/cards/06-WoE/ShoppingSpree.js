const Card = require('../../Card.js');
const { DiscardCardAction } = require('../../GameActions/index.js');

class ShoppingSpree extends Card {
    // Play: Discard your hand. Draw a card for each card discarded
    // this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            })),
            then: {
                gameAction: ability.actions.draw((context) => ({
                    amount: DiscardCardAction.collectDiscardedCards(context.preThenEvents || [])
                        .length
                }))
            }
        });
    }
}

ShoppingSpree.id = 'shopping-spree';

module.exports = ShoppingSpree;
