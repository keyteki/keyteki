import Card from '../../Card.js';

class ShardOfResurgence extends Card {
    // Action: Archive a card from your discard pile for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num:
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length,
                action: ability.actions.archive({
                    promptForSelect: {
                        activePromptTitle: 'Choose a card to archive',
                        controller: 'self',
                        location: 'discard',
                        message: '{0} uses {1} to archive {2}',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                })
            })),
            effect: 'archive a card from their discard pile for each friendly shard'
        });
    }
}

ShardOfResurgence.id = 'shard-of-resurgence';

export default ShardOfResurgence;
