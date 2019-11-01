const Card = require('../../Card.js');

class Murmook extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(1)
        });
    }
}

Murmook.id = 'murmook';

module.exports = Murmook;
