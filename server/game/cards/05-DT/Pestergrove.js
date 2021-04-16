const Card = require('../../Card.js');

class Pestergrove extends Card {
    // Each creature enters play enraged.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.entersPlayEnraged()
        });
    }
}

Pestergrove.id = 'pestergrove';

module.exports = Pestergrove;
