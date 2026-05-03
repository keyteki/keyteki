const Card = require('../../Card.js');

class GiltEmGood extends Card {
    // Play: Each friendly flank creature captures 1A. If a yellow key is forged, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay.filter((card) => card.isOnFlank())
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.game.isKeyForged('yellow'),
                gameAction: ability.actions.capture((context) => ({
                    amount: 1,
                    target: context.player.creaturesInPlay.filter((card) => card.isOnFlank())
                })),
                message: '{0} uses {1} to repeat the preceding effect'
            })
        });
    }
}

GiltEmGood.id = 'gilt--em-good';

module.exports = GiltEmGood;
