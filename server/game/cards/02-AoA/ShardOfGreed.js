const Card = require('../../Card.js');

class ShardOfGreed extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.gainAmber(context => ({
                amount: context.player.cardsInPlay.filter(card => card.hasTrait('shard')).length
            }))
        });
    }
}

ShardOfGreed.id = 'shard-of-greed';

module.exports = ShardOfGreed;
