import Card from '../../Card.js';

class Kangaphant extends Card {
    // Each creature gains, Reap: Destroy this creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: () => true,
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.destroy()
            })
        });
    }
}

Kangaphant.id = 'kangaphant';

export default Kangaphant;
