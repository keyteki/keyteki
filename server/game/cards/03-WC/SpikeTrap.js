const Card = require('../../Card.js');

class SpikeTrap extends Card {
    // Omni: Destroy Spike Trap. If you do, deal 3D to each flank creature.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                message: '{0} uses {1} to deal 3 damage to {3}',
                messageArgs: (context) => [
                    context.game.creaturesInPlay.filter((card) => card.isOnFlank())
                ],
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 3,
                    target: context.game.creaturesInPlay.filter((card) => card.isOnFlank())
                }))
            }
        });
    }
}

SpikeTrap.id = 'spike-trap';

module.exports = SpikeTrap;
