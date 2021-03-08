const Card = require('../../Card.js');

class Director extends Card {
    //Deploy. Taunt.
    //Play: Each of $this's neighbors captures 1A.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: deploy, taunt
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.game.creaturesInPlay.filter((card) =>
                    context.source.neighbors.includes(card)
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

Director.id = 'director';

module.exports = Director;
