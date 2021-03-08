const Card = require('../../Card.js');

class Dt177 extends Card {
    //Play/Reap: You may exalt a friendly non-Saurian creature. If you do, reap with that creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('saurian'),
                gameAction: ability.actions.exalt({ amount: 1 })
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.reap({ target: preThenContext.target })
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Dt177.id = 'dt177';

module.exports = Dt177;
