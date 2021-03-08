const Card = require('../../Card.js');

class Dt179 extends Card {
    //Play: Lose 1A. If you do, purge a creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: 1,
                target: context.player
            })),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.purge()
                }
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

Dt179.id = 'dt179';

module.exports = Dt179;
