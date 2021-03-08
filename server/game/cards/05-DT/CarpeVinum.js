const Card = require('../../Card.js');

class CarpeVinum extends Card {
    //Play: Exalt two enemy creatures.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: '2',
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exalt({ amount: 1 })
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

CarpeVinum.id = 'carpe-vinum';

module.exports = CarpeVinum;
