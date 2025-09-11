const Card = require('../../Card.js');

class WindsOfDeath extends Card {
    // Play: Each player archives each creature from their discard
    // pile. Destroy each creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.archive((context) => ({
                target: context.player.discard
                    .filter((c) => c.type === 'creature')
                    .concat(
                        context.player.opponent
                            ? context.player.opponent.discard.filter((c) => c.type === 'creature')
                            : []
                    )
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay
                })),
                message: '{0} uses {1} to destroy each creature'
            }
        });
    }
}

WindsOfDeath.id = 'winds-of-death';

module.exports = WindsOfDeath;
