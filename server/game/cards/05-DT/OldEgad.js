const Card = require('../../Card.js');

class OldEgad extends Card {
    //Destroyed: Ward each of $this's neighbors.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.ward((context) => ({
                target: context.game.creaturesInPlay.filter((card) =>
                    context.source.neighbors.includes(card)
                )
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

OldEgad.id = 'old-egad';

module.exports = OldEgad;
