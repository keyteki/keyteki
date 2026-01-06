const Card = require('../../Card.js');
const { DiscardCardAction } = require('../../GameActions/index.js');

class TideDown extends Card {
    // Play: Discard up to 3 cards from your hand. For each card discarded this way, choose a card in your discard pile and archive it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                mode: 'upTo',
                numCards: 3,
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: DiscardCardAction.collectDiscardedCards(context.preThenEvents || [])
                        .length,
                    action: ability.actions.archive({
                        promptForSelect: {
                            activePromptTitle: 'Choose a card to archive',
                            controller: 'self',
                            location: 'discard',
                            message: '{0} uses {1} to archive {2}',
                            messageArgs: (cards) => [context.player, context.source, cards]
                        }
                    })
                }))
            }
        });
    }
}

TideDown.id = 'tide-down';

module.exports = TideDown;
