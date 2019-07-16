const Card = require('../../Card.js');

class Knoxx extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => this.neighbors.length * 3)
        });
    }
}

Knoxx.id = 'knoxx';

module.exports = Knoxx;
