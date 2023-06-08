const Card = require('../../Card.js');

class Streke extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // While Streke is not on a flank, your opponent refills their hand to 1less cardduring their draw cards step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

Streke.id = 'streke';

module.exports = Streke;
