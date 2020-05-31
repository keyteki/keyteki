const Card = require('../../Card.js');

class ShardOfGreed extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    context.player === this.owner
                        ? context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length
                        : context.player.cardsInPlay.filter((card) => card.hasTrait('shard'))
                              .length + 1
            }))
        });
    }
}

ShardOfGreed.id = 'shard-of-greed';

module.exports = ShardOfGreed;
