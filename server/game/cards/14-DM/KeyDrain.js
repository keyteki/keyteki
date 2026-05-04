const Card = require('../../Card.js');
const { DiscardCardAction } = require('../../GameActions/index.js');

class KeyDrain extends Card {
    // Play: You may discard any number of cards from your hand. Then, forge a key at +9A current cost, reduced by 1A for each card discarded this way.
    setupCardAbilities(ability) {
        this.play({
            effect: 'forge a key, reduced by 1 amber for each card discarded',
            target: {
                controller: 'self',
                mode: 'unlimited',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey((context) => ({
                    modifier:
                        9 - DiscardCardAction.collectDiscardedCards(context.preThenEvents).length
                }))
            }
        });
    }
}

KeyDrain.id = 'key-drain';

module.exports = KeyDrain;
