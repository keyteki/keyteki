const Card = require('../../Card.js');

class Tentacle extends Card {
    //Taunt. Skirmish.
    //$this cannot reap.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: taunt, skirmish
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cardCannot('reap')
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Tentacle.id = 'tentacle';

module.exports = Tentacle;
