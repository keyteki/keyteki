const Card = require('../../Card.js');

class Zap extends Card {
    // Play: Deal 1 to a creature for each house represented among creatures in play.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'deal 1 damage to a creature for each house represented among creatures in play',
            gameAction: ability.actions.allocateDamage((context) => ({
                numSteps: context.game.getHousesInPlay(context.game.creaturesInPlay).length
            }))
        });
    }
}
Zap.id = 'zap';

module.exports = Zap;
