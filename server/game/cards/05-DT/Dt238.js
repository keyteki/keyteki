const Card = require('../../Card.js');

class Dt238 extends Card {
    //Play: Deal 2D to a creature. If it is not destroyed, it captures 1A from its own side.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) =>
                    !(
                        context.preThenEvent.destroyEvent &&
                        context.preThenEvent.destroyEvent.resolved
                    ),
                gameAction: ability.actions.capture((context) => ({
                    target: preThenContext.target,
                    amount: 1,
                    player: context.player.opponent
                }))
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

Dt238.id = 'dt238';

module.exports = Dt238;
