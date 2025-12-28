const Card = require('../../Card.js');
const { DiscardCardAction } = require('../../GameActions/index.js');

class Plummet extends Card {
    // Play: Discard your hand. Deal 1 to each creature for each card
    // discarded this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            })),
            then: {
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay,
                    amount: DiscardCardAction.collectDiscardedCards(context.preThenEvents || [])
                        .length
                })),
                message: '{0} uses {1} to deal {3} damage to each creature',
                messageArgs: (context) => [
                    DiscardCardAction.collectDiscardedCards(context.preThenEvents || []).length
                ]
            }
        });
    }
}

Plummet.id = 'plummet';

module.exports = Plummet;
