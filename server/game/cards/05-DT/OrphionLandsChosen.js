const Card = require('../../Card.js');

class OrphionLandsChosen extends Card {
    //While the tide is low, $this gets +3 armor and gains, "Reap: Capture 2A."
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideLow(),
            effect: [
                ability.effects.modifyArmor(() => 3),
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.capture({ amount: 2 })
                })
            ]
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

OrphionLandsChosen.id = 'orphion-land-s-chosen';

module.exports = OrphionLandsChosen;
