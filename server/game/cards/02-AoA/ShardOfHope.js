const Card = require('../../Card.js');

class ShardOfHope extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent && context.player.opponent.amber > 0,
            target: {
                mode: 'exactly',
                controller: 'self',
                numCards: (context) =>
                    Math.min(
                        context.player.opponent.amber,
                        context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length
                    ),
                gameAction: ability.actions.capture()
            },
            effect: 'make {1} of their creatures capture an amber from {2}',
            effectArgs: (context) => [
                context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length,
                context.player.opponent
            ]
        });
    }
}

ShardOfHope.id = 'shard-of-hope';

module.exports = ShardOfHope;
