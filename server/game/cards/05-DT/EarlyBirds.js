const Card = require('../../Card.js');

class EarlyBirds extends Card {
    //Alpha.
    //Play: Ready each Shadows card.
    //This card has been translated from Russian and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: alpha
        this.play({
            gameAction: ability.actions.ready((context) => ({
                target: context.game.cardsInPlay.filter((card) => card.hasHouse('shadows'))
            }))
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Russian and is subject to change."
          ]
        }*/
    }
}

EarlyBirds.id = 'early-birds';

module.exports = EarlyBirds;
