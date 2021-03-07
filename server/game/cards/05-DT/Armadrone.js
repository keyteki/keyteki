const Card = require('../../Card.js');

class Armadrone extends Card {
    //Fight: Steal 1A.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal({ amount: 1 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Armadrone.id = 'armadrone';

module.exports = Armadrone;
