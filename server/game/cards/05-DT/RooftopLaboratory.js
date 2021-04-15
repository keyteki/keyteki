const Card = require('../../Card.js');

class RooftopLaboratory extends Card {
    // Each friendly Scientist creature enters play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: (card) => card.type === 'creature' && card.hasTrait('scientist'),
            effect: ability.effects.entersPlayReady()
        });
    }
}

RooftopLaboratory.id = 'rooftop-laboratory';

module.exports = RooftopLaboratory;
