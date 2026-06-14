const Card = require('../../Card.js');

class ShardOfHope extends Card {
    // Action: A friendly creature captures
    // 1A for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            effect: 'capture {1} amber from {2}',
            effectArgs: (context) => [
                Math.min(
                    context.player.opponent.amber,
                    1 +
                        context.player.cardsInPlay.filter(
                            (card) => card !== context.source && card.hasTrait('shard')
                        ).length
                ),
                context.player.opponent
            ],
            gameAction: ability.actions.allocateCapture((context) => ({
                numAmber: Math.min(
                    context.player.opponent.amber,
                    1 +
                        context.player.cardsInPlay.filter(
                            (card) => card !== context.source && card.hasTrait('shard')
                        ).length
                ),
                controller: 'self',
                menuTitle: 'Choose a creature to capture 1 amber'
            }))
        });
    }
}

ShardOfHope.id = 'shard-of-hope';

module.exports = ShardOfHope;
