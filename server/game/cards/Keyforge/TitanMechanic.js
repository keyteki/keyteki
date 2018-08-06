const Card = require('../../Card.js');

class TitanMechanic extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: this.isOnFlank(),
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(-1)
        });
    }
}

TitanMechanic.id = 'titan-mechanic'; // This is a guess at what the id might be - please check it!!!

module.exports = TitanMechanic;
