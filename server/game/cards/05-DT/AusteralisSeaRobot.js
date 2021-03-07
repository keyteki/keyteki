const Card = require('../../Card.js');

class AusteralisSeaRobot extends Card {
    //Reap: Deal 2D to a creature. If this damage destroys that creature, raise the tide.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent && context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.raiseTide()
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

AusteralisSeaRobot.id = 'austeralis-sea-robot';

module.exports = AusteralisSeaRobot;
