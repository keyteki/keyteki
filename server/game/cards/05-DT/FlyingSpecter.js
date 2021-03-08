const Card = require('../../Card.js');

class FlyingSpecter extends Card {
    //After your opponent raises the tide, destroy $this.
    //Action: If the tide is high, steal 1A.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.source
            }))
        });
        this.action({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal({ amount: 1 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

FlyingSpecter.id = 'flying-specter-';

module.exports = FlyingSpecter;
