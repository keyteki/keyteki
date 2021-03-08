const Card = require('../../Card.js');

class EasyMarks extends Card {
    //Play: Exalt each damaged enemy creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt((context) => ({
                target: context.player.opponent.creaturesInPlay.filter((card) =>
                    card.hasToken('damage')
                ),
                amount: 1
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

EasyMarks.id = 'easy-marks';

module.exports = EasyMarks;
