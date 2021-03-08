const Card = require('../../Card.js');

class TrickleDownTheory extends Card {
    //Play: Raise the tide.
    //Omni: Gain 1A if your opponent has 6A or more.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });
        this.omni({
            condition: (context) => context.player.opponent.amber >= 6,
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

TrickleDownTheory.id = 'trickle-down-theory-';

module.exports = TrickleDownTheory;
