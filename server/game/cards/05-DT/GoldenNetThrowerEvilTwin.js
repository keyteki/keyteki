const Card = require('../../Card.js');

class GoldenNetThrowerEvilTwin extends Card {
    //Enhance PTPT. (These icons have already been added to cards in your deck.)
    //Reap: Ready and use a friendly non-Aquan creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: enhance
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasTrait('aquan'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
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

GoldenNetThrowerEvilTwin.id = 'golden-net-thrower-evil-twin';

module.exports = GoldenNetThrowerEvilTwin;
