const Card = require('../../Card.js');

class RoofLaboratory extends Card {
    //Each friendly Scientist creature enters play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: (card) => card.type === 'creature' && card.hasTrait('scientist'),
            effect: ability.effects.entersPlayReady()
        });
    }
}

RoofLaboratory.id = 'roof-laboratory';

module.exports = RoofLaboratory;
