const Card = require('../../Card.js');

class Silvertooth extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayReady()
        });
    }
}

Silvertooth.id = 'silvertooth';

module.exports = Silvertooth;
