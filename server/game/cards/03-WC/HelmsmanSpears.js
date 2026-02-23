import Card from '../../Card.js';
import { DiscardCardAction } from '../../GameActions/index.js';
class HelmsmanSpears extends Card {
    // Fight/Reap: Discard any number of cards from your hand. Draw a card for each card discarded this way.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                controller: 'self',
                mode: 'unlimited',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw((context) => ({
                    amount: DiscardCardAction.collectDiscardedCards(context.preThenEvents).length
                }))
            }
        });
    }
}

HelmsmanSpears.id = 'helmsman-spears';

export default HelmsmanSpears;
