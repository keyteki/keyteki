const Card = require('../../Card.js');

class ColtSleven extends Card {
    // Play: For each +1 power counter on each creature, deal 1 damage to a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.allocateDamage((context) => ({
                amount: 1,
                numSteps: context.game.creaturesInPlay.reduce(
                    (sum, card) => sum + (card.tokens.power || 0),
                    0
                )
            }))
        });
    }
}

ColtSleven.id = 'colt-sleven';

module.exports = ColtSleven;
