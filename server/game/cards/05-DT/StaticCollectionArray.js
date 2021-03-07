const Card = require('../../Card.js');

class StaticCollectionArray extends Card {
    //While the tide is high, your keys cost -1A. While the tide is low, your keys cost +1A.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.modifyKeyCost(() => -1)
        });
        this.persistentEffect({
            condition: (context) => context.player.isTideLow(),
            effect: ability.effects.modifyKeyCost(() => 1)
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

StaticCollectionArray.id = 'static-collection-array';

module.exports = StaticCollectionArray;
