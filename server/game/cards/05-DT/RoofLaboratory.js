const Card = require('../../Card.js');

class RoofLaboratory extends Card {
    //Each friendly Scientist creature enters play ready.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: (card) => card.type === 'creature' && card.hasTrait('scientist'),
            effect: ability.effects.entersPlayReady()
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

RoofLaboratory.id = 'roof-laboratory';

module.exports = RoofLaboratory;
