const Card = require('../../Card.js');

class Dt231 extends Card {
    //Action: Steal 2A if your opponent has 6A or more.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.opponent.amber >= 6,
            gameAction: ability.actions.steal({ amount: 2 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Dt231.id = 'dt231';

module.exports = Dt231;
