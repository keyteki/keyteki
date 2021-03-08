const Card = require('../../Card.js');

class OrphielSeasChosen extends Card {
    //While the tide is high, $this gains skirmish and, "Fight: Gain 2A."
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: [
                ability.effects.addKeyword({
                    skirmish: 1
                }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainAmber({ amount: 2 })
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

OrphielSeasChosen.id = 'orphiel-sea-s-chosen';

module.exports = OrphielSeasChosen;
