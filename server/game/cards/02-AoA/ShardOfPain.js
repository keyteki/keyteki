const Card = require('../../Card.js');

class ShardOfPain extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'deal 1 damage to a creature for each friendly shard',
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps: context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length
            }))
        });
    }
}

ShardOfPain.id = 'shard-of-pain';

module.exports = ShardOfPain;
