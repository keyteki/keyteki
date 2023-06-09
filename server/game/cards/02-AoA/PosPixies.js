const Card = require('../../Card.js');

class PosPixies extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // A stolen or captured from your pool is taken from the common supply instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.stealFromPool(), ability.effects.captureFromPool()]
        });
    }
}

PosPixies.id = 'po-s-pixies';

module.exports = PosPixies;
