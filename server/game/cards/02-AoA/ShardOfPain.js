const Card = require('../../Card.js');

class ShardOfPain extends Card {
    // Action: Deal 1D to an enemy creature for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            effect: 'deal 1 damage to a creature for each friendly shard',
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps:
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length
            }))
        });
    }
}

ShardOfPain.id = 'shard-of-pain';

module.exports = ShardOfPain;
