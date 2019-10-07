const Card = require('../../Card.js');

class SpikeTrap extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                effect: 'sacrifice {1} and deal 3 damage to {0}',
                effectArgs: context => context.source,
                gameAction: ability.actions.dealDamage(context => ({
                    amount: 3,
                    target: context.game.creaturesInPlay.filter(card => card.isOnFlank())
                }))
            }
        });
    }
}

SpikeTrap.id = 'spike-trap';

module.exports = SpikeTrap;
