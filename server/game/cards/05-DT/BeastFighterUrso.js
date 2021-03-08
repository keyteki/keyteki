const Card = require('../../Card.js');

class BeastFighterUrso extends Card {
    //Play/Reap: You may unstun a creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.removeStun()
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

BeastFighterUrso.id = 'beast-fighter-urso';

module.exports = BeastFighterUrso;
