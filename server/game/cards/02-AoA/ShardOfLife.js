const Card = require('../../Card.js');

class ShardOfLife extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'exactly',
                numCards: (context) =>
                    context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length,
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

ShardOfLife.id = 'shard-of-life';

module.exports = ShardOfLife;
