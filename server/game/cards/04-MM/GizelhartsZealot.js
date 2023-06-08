const Card = require('../../Card.js');

class GizelhartsZealot extends Card {
    // Gizelharts Zealot enters play ready and enraged.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.entersPlayReady(), ability.effects.entersPlayEnraged()]
        });
    }
}

GizelhartsZealot.id = 'gizelhart-s-zealot';

module.exports = GizelhartsZealot;
