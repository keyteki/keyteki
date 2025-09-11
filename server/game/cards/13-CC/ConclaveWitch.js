const Card = require('../../Card.js');

class ConclaveWitch extends Card {
    // Enhance 1.
    // Action: Gain 1 amber for each friendly Untamed creature.
    setupCardAbilities(ability) {
        this.action({
            effect: 'gain {1} amber, one for each friendly Untamed creature',
            effectArgs: (context) => [
                context.player.creaturesInPlay.filter((card) => card.hasHouse('untamed')).length
            ],
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.creaturesInPlay.filter((card) => card.hasHouse('untamed'))
                    .length
            }))
        });
    }
}

ConclaveWitch.id = 'conclave-witch';

module.exports = ConclaveWitch;
