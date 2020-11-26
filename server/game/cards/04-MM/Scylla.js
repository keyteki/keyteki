const Card = require('../../Card.js');

class Scylla extends Card {
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

module.exports = Scylla;
