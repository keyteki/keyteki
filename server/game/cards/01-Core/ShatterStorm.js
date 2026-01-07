const Card = require('../../Card.js');

class ShatterStorm extends Card {
    // Play: Lose all your A. Then, your opponent loses triple the amount
    // of A you lost this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player,
                amount: context.player.amber
            })),
            then: (context) => ({
                gameAction: ability.actions.loseAmber({
                    amount: 3 * context.player.amber
                }),
                message: '{0} uses {1} to make {3} lose {4} amber',
                messageArgs: (context) => [
                    context.player.opponent,
                    context.preThenEvent.amount * 3 <= context.player.opponent.amber
                        ? context.preThenEvent.amount * 3
                        : context.player.opponent.amber
                ]
            })
        });
    }
}

ShatterStorm.id = 'shatter-storm';

module.exports = ShatterStorm;
