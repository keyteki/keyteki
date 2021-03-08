const Card = require('../../Card.js');

class Dt173 extends Card {
    //Play: Destroy each creature with power 4 or lower. Gain 1 chain.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.power <= 4)
                })),
                ability.actions.gainChains({ amount: 1 })
            ])
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Dt173.id = 'dt173';

module.exports = Dt173;
