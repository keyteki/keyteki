const Card = require('../../Card.js');

class OdoacThePatrician extends Card {
    // Play: Capture 1A.
    // While Odoac the Patrician has A on it, your A cannot be stolen.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 1 })
        });
        this.persistentEffect({
            condition: (context) => context.source.amber > 0,
            effect: ability.effects.playerCannot('steal')
        });
    }
}

OdoacThePatrician.id = 'odoac-the-patrician';

module.exports = OdoacThePatrician;
