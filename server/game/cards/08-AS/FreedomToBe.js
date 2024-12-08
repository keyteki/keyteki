const Card = require('../../Card.js');

class FreedomToBe extends Card {
    // Forge a key at +4A current cost, reduced by 1A for each Skyborn
    // creature on a flank.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier:
                    4 -
                    context.game.creaturesInPlay.filter(
                        (c) => c.hasHouse('skyborn') && c.isOnFlank()
                    ).length
            }))
        });
    }
}

FreedomToBe.id = 'freedom-to-be';

module.exports = FreedomToBe;
