const Card = require('../../Card.js');

class SkipperHuko extends Card {
    // After Reap: Capture 1A. If you do, exalt each enemy flank creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture(),
            then: {
                condition: (context) =>
                    context.player.opponent && context.player.opponent.creaturesInPlay.length > 0,
                gameAction: ability.actions.exalt((context) => ({
                    target: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((c) => c.isOnFlank())
                        : []
                })),
                message: '{0} uses {1} to exalt {3}',
                messageArgs: (context) => [
                    context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((c) => c.isOnFlank())
                        : []
                ]
            }
        });
    }
}

SkipperHuko.id = 'skipper-hukŏ';

module.exports = SkipperHuko;
