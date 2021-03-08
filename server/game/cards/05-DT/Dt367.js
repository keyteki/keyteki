const Card = require('../../Card.js');

class Dt367 extends Card {
    //Reap: Keys cost +2A during your opponent's next turn.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.lastingEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(() => 2)
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

Dt367.id = 'dt367';

module.exports = Dt367;
