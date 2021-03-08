const Card = require('../../Card.js');

class ArchonsRecall extends Card {
    //Omega.
    //Play: Draw 5 cards.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: omega
        this.play({
            gameAction: ability.actions.draw({ amount: 5 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

ArchonsRecall.id = 'archon-s-recall';

module.exports = ArchonsRecall;
