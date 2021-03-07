const Card = require('../../Card.js');

class TotalCatastrophe extends Card {
    //Play: Deal 1D to each creature. Destroy each upgrade.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay,
                    amount: 1
                })),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.flatMap((card) => card.upgrades || [])
                }))
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

TotalCatastrophe.id = 'total-catastrophe-';

module.exports = TotalCatastrophe;
