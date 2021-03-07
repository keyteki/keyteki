const Card = require('../../Card.js');

class Hammergram extends Card {
    //Play: Deal 3D to a creature and stun it.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 3 }),
                    ability.actions.stun()
                ])
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

Hammergram.id = 'hammergram';

module.exports = Hammergram;
