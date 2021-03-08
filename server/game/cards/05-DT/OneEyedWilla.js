const Card = require('../../Card.js');

class OneEyedWilla extends Card {
    //While the tide is high, $this gains elusive and skirmish.
    //Fight: Steal 1A.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: [
                ability.effects.addKeyword({
                    elusive: 1
                }),
                ability.effects.addKeyword({
                    skirmish: 1
                })
            ]
        });
        this.fight({
            gameAction: ability.actions.steal({ amount: 1 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

OneEyedWilla.id = 'one-eyed-willa';

module.exports = OneEyedWilla;
