const Card = require('../../Card.js');

class OldEgadEvilTwin extends Card {
    //Destroyed: Enrage each enemy creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.enrage((context) => ({
                target: context.player.opponent.creaturesInPlay
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

OldEgadEvilTwin.id = 'old-egad-evil-twin';

module.exports = OldEgadEvilTwin;
