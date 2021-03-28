const Card = require('../../Card.js');

class GizelhartsZealot extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.entersPlayReady(), ability.effects.entersPlayEnraged()]
        });
    }
}

GizelhartsZealot.id = 'gizelhart-s-zealot';

module.exports = GizelhartsZealot;
