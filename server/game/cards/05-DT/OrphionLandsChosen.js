const Card = require('../../Card.js');

class OrphionLandsChosen extends Card {
    //While the tide is low, $this gains +3 armor and, "Reap: Capture 2A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideLow(),
            effect: [
                ability.effects.modifyArmor(3),
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.capture({ amount: 2 })
                })
            ]
        });
    }
}

OrphionLandsChosen.id = 'orphion-land-s-chosen';

module.exports = OrphionLandsChosen;
