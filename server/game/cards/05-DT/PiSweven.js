const Card = require('../../Card.js');

class PiSweven extends Card {
    //Reap: If the tide is high, draw 3 cards.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.draw({ amount: 3 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

PiSweven.id = 'pi-sweven';

module.exports = PiSweven;
