const Card = require('../../Card.js');

class ShardOfGreed extends Card {
    // Action: Gain 1A for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length
            }))
        });
    }
}

ShardOfGreed.id = 'shard-of-greed';

module.exports = ShardOfGreed;
