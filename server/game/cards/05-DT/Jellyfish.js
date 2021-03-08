const Card = require('../../Card.js');

class Jellyfish extends Card {
    //Hazardous 4.
    //Destroyed: If the tide is high, archive $this.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: hazardous 4
        this.destroyed({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.archive((context) => ({
                target: context.source,
                location: 'hand'
            }))
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Jellyfish.id = 'jellyfish-';

module.exports = Jellyfish;
