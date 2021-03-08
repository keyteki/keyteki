const Card = require('../../Card.js');

class DredgingDruid extends Card {
    //Elusive.
    //Reap: If the tide is high, put up to 3 creatures from your discard pile on top of your deck.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: elusive
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            target: {
                mode: 'upTo',
                numCards: '3',
                cardType: 'creature',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck({ location: 'discard' })
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

DredgingDruid.id = 'dredging-druid-';

module.exports = DredgingDruid;
