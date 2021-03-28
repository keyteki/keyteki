const Card = require('../../Card.js');

class OdoacThePatrician extends Card {
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
