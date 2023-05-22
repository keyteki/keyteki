const Card = require('../../Card.js');

class CursedRelic extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.cardCannot('play'), ability.effects.cardCannot('discard')]
        });
    }
}

CursedRelic.id = 'cursed-relic';

module.exports = CursedRelic;
