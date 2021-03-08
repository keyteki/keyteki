const Card = require('../../Card.js');

class SgsLuminiferous extends Card {
    //Action: Exhaust up to 4 friendly Sanctum creatures. Stun and exalt a creature for each creature exhausted this way.
    //This card has been translated from Russian and is subject to change.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'upTo',
                numCards: '4',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.sequential([
                        ability.actions.stun(),
                        ability.actions.exalt({ amount: 1 })
                    ])
                }
            }
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Russian and is subject to change."
          ]
        }*/
    }
}

SgsLuminiferous.id = 'sgs-luminiferous-';

module.exports = SgsLuminiferous;
