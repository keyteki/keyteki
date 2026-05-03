const Card = require('../../Card.js');

class ColtSleven extends Card {
    // Enhance damage power power.
    // Play: For each +1 power counter on each creature, deal 1 damage to a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.allocateDamage((context) => ({
                amount: 1,
                numSteps: context.game.creaturesInPlay.reduce(
                    (sum, card) => sum + card.powerCounters,
                    0
                )
            })),
            effect: 'deal 1 damage to a creature {1} time{2}',
            effectArgs: (context) => {
                const total = context.game.creaturesInPlay.reduce(
                    (sum, card) => sum + card.powerCounters,
                    0
                );
                return [total, total === 1 ? '' : 's'];
            }
        });
    }
}

ColtSleven.id = 'colt-sleven';

module.exports = ColtSleven;
