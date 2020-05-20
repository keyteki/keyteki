const Card = require('../../Card.js');

class ShardOfStrength extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: context.player.cardsInPlay.filter((card) => card.hasTrait('shard'))
                        .length
                }))
            }
        });
    }
}

ShardOfStrength.id = 'shard-of-strength';

module.exports = ShardOfStrength;
