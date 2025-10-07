import Card from '../../Card.js';

class OrphionLandsChosen extends Card {
    // (T) While the tide is low, Orphion, Land’s Chosen gets +3 armor and gains, “Reap: Capture 2A.”
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

export default OrphionLandsChosen;
