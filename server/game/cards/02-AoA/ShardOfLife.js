const Card = require('../../Card.js');

class ShardOfLife extends Card {
    // Action: Shuffle a card from your discard pile into your deck for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'exactly',
                numCards: (context) =>
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length,
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

ShardOfLife.id = 'shard-of-life';

module.exports = ShardOfLife;
