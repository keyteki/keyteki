const Card = require('../../Card.js');

class Lex extends Card {
    //Play/Fight: If the tide is high, you may exalt 1 creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            condition: (context) => context.player.isTideHigh(),
            target: {
                optional: true,
                cardType: 'creature',
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

Lex.id = 'lex-';

module.exports = Lex;
