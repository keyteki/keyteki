const Card = require('../../Card.js');

class Toad extends Card {
    // Toad cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Toad.id = 'toad';

module.exports = Toad;
