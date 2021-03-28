const Card = require('../../Card.js');

class Streke extends Card {
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
