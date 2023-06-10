const Card = require('../../Card.js');

class TitanMechanic extends Card {
    // While Titan Mechanic is on a flank,
    // each key costs 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isOnFlank(),
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(-1)
        });
    }
}

TitanMechanic.id = 'titan-mechanic';

module.exports = TitanMechanic;
