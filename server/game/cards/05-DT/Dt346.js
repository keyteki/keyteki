const Card = require('../../Card.js');

class Dt346 extends Card {
    //Play: Exhaust 2 creatures. Deal 2D to each exhausted creatures.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: '2',
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.exhausted),
                amount: 2
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

Dt346.id = 'dt346';

module.exports = Dt346;
