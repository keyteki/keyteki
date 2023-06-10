const Card = require('../../Card.js');

class MartianGenerosity extends Card {
    // Play: Lose all of your A. Draw 2cards for each Alost.
    setupCardAbilities(ability) {
        this.play({
            effect: 'lose {1} amber, and draw {2} cards',
            effectArgs: (context) => [context.player.amber, context.player.amber * 2],
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player,
                amount: context.player.amber
            })),
            then: (context) => ({
                gameAction: ability.actions.draw({
                    amount: 2 * context.player.amber
                })
            })
        });
    }
}

MartianGenerosity.id = 'martian-generosity';

module.exports = MartianGenerosity;
