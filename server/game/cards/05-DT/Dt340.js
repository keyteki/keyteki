const Card = require('../../Card.js');

class Dt340 extends Card {
    //Poison.
    //During their “draw cards” step, your opponent refills their hand to 1 less card.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: poison
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(() => -1)
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Dt340.id = 'dt340';

module.exports = Dt340;
