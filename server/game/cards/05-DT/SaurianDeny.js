const Card = require('../../Card.js');

class SaurianDeny extends Card {
    //Play: Destroy an enemy creature with A on it.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.destroy()
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

SaurianDeny.id = 'saurian-deny-';

module.exports = SaurianDeny;
