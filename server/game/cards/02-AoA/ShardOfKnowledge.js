const Card = require('../../Card.js');

class ShardOfKnowledge extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw((context) => ({
                amount: context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length
            }))
        });
    }
}

ShardOfKnowledge.id = 'shard-of-knowledge';

module.exports = ShardOfKnowledge;
