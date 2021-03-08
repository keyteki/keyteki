const Card = require('../../Card.js');

class ExceptionalAssistance extends Card {
    //You can only play this card if the tide is high.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => !context.player.isTideHigh())
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

ExceptionalAssistance.id = 'exceptional-assistance-';

module.exports = ExceptionalAssistance;
