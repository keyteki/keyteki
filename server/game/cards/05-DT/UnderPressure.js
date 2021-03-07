const Card = require('../../Card.js');

class UnderPressure extends Card {
    //This creature cannot ready.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('ready')
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

UnderPressure.id = 'under-pressure';

module.exports = UnderPressure;
