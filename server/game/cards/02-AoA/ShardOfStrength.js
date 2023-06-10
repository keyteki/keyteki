const Card = require('../../Card.js');

class ShardOfStrength extends Card {
    // Action: Give a friendly creature a +1power counter for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount:
                        1 +
                        context.player.cardsInPlay.filter(
                            (card) => card !== context.source && card.hasTrait('shard')
                        ).length
                }))
            }
        });
    }
}

ShardOfStrength.id = 'shard-of-strength';

module.exports = ShardOfStrength;
