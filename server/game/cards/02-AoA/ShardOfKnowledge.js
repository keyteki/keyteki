const Card = require('../../Card.js');

class ShardOfKnowledge extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw((context) => ({
                amount:
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length
            }))
        });
    }
}

ShardOfKnowledge.id = 'shard-of-knowledge';

module.exports = ShardOfKnowledge;
