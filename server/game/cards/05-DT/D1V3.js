const Card = require('../../Card.js');

class D1V3 extends Card {
    //While the tide is high, this creature gains skirmish.
    //While the tide is low, this creature gains elusive.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.addKeyword({
                skirmish: 1
            })
        });
        this.whileAttached({
            condition: (context) => context.player.isTideLow(),
            effect: ability.effects.addKeyword({
                elusive: 1
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

D1V3.id = 'd1-v3';

module.exports = D1V3;
