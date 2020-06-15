const Card = require('../../Card.js');

class TitanEngineer extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.modifyKeyCost(1)
        });
    }
}

TitanEngineer.id = 'titan-engineer';

module.exports = TitanEngineer;
