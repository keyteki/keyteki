const Card = require('../../Card.js');

class ShardOfHope extends Card {
    // Action: A friendly creature captures
    // 1A for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: Math.min(
                    context.player.opponent.amber,
                    1 +
                        context.player.cardsInPlay.filter(
                            (card) => card !== context.source && card.hasTrait('shard')
                        ).length
                ),
                action: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to capture',
                        cardType: 'creature',
                        controller: 'self'
                    }
                })
            })),
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
            ]
        });
    }
}

ShardOfHope.id = 'shard-of-hope';

module.exports = ShardOfHope;
