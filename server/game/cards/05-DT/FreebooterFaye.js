const Card = require('../../Card.js');

class FreebooterFaye extends Card {
    //Play: Raise the tide.
    //Reap: Steal 1A if the tide is high.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });
        this.reap({
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

FreebooterFaye.id = 'freebooter-faye';

module.exports = FreebooterFaye;
