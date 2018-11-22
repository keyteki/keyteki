const Card = require('../../Card.js');

class Murmook extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(1)
        });
    }
}

Murmook.id = 'murmook'; // This is a guess at what the id might be - please check it!!!

module.exports = Murmook;
