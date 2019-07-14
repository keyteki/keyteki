const Card = require('../../Card.js');

class ShardOfPain extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage(context => ({
                    amount: context.player.cardsInPlay.filter(card => card.hasTrait('shard')).length
                }))
            }
        });
    }
}

ShardOfPain.id = 'shard-of-pain';

module.exports = ShardOfPain;
