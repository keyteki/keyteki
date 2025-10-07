import Card from '../../Card.js';

class VaradTheIndulgent extends Card {
    // Varad the Indulgent gets +1 power for each on it.
    //
    // After another friendly Geistoid creature fights, Varad the
    // Indulgent captures 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.amber)
        });

        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.fightEvent &&
                    event.fightEvent.attackerClone.controller === context.source.controller &&
                    event.fightEvent.attackerClone.hasHouse('geistoid')
            },
            gameAction: ability.actions.capture((context) => ({ target: context.source }))
        });
    }
}

VaradTheIndulgent.id = 'varad-the-indulgent';

export default VaradTheIndulgent;
