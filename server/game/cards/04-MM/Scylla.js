import Card from '../../Card.js';

class Scylla extends Card {
    // Each enemy creature gains, "Reap: Deal 4 to this creature."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 4,
                    target: context.source
                }))
            })
        });
    }
}

Scylla.id = 'scylla';

export default Scylla;
