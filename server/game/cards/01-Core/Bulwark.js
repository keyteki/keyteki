const Card = require('../../Card.js');

class Bulwark extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => this.neighbors.includes(card),
            effect: ability.effects.modifyArmor(2)
        });
    }
}

Bulwark.id = 'bulwark'; // This is a guess at what the id might be - please check it!!!

module.exports = Bulwark;
