const Card = require('../../Card.js');

class IsotropicCore extends Card {
    //Each friendly creature gains Hazardous 1.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.addKeyword({
                hazardous: 1
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

IsotropicCore.id = 'isotropic-core';

module.exports = IsotropicCore;
