const Card = require('../../Card.js');

class Dt232 extends Card {
    //Play: Use an opponent's artifact as if it were yours.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            }
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Dt232.id = 'dt232';

module.exports = Dt232;
