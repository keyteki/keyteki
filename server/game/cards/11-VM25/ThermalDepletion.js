const Card = require('../../Card.js');

class ThermalDepletion extends Card {
    // Play: Until the start of your next turn, creatures cannot ready.
    setupCardAbilities(ability) {
        this.play({
            effect: 'prevent creatures from readying until the start of their next turn',
            gameAction: ability.actions.untilStartOfYourNextTurn({
                targetController: 'any',
                effect: ability.effects.cardCannot('ready')
            })
        });
    }
}

ThermalDepletion.id = 'thermal-depletion';

module.exports = ThermalDepletion;
