const Card = require('../../Card.js');

class Bulwark extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.modifyArmor(2)
        });
    }
}

Bulwark.id = 'bulwark';

module.exports = Bulwark;
