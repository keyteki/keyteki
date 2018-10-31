const Card = require('../../Card.js');

class ShatterStorm extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber(context => ({
                amount: context.player.amber
            })),
            then: context => ({
                gameAction: ability.actions.loseAmber(context => ({
                    amount: 3 * context.player.amber
                }))
            })
        });
    }
}

ShatterStorm.id = 'shatter-storm'; // This is a guess at what the id might be - please check it!!!

module.exports = ShatterStorm;
