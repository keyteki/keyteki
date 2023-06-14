const Card = require('../../Card.js');

class Knoxx extends Card {
    // Knoxx gets +3power for each neighbor it has.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.neighbors.length * 3)
        });
    }
}

Knoxx.id = 'knoxx';

module.exports = Knoxx;
