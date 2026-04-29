const Card = require('../../Card.js');

class PsychicNetwork extends Card {
    // Play: Steal 1<A> for each friendly ready Mars creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.creaturesInPlay.filter(
                    (card) => card.hasHouse('mars') && !card.exhausted
                ).length,
                action: ability.actions.steal({ amount: 1 }),
                message: '{0} uses {1} to steal 1 amber'
            }))
        });
    }
}

PsychicNetwork.id = 'psychic-network';

module.exports = PsychicNetwork;
