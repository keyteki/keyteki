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
                })
            })
        });
    }
}

ShatterStorm.id = 'shatter-storm';

module.exports = ShatterStorm;
