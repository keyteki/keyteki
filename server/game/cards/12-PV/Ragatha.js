const Card = require('../../Card.js');

class Ragatha extends Card {
    // Treachery.
    // Each enemy creature gains, "After Reap: Deal 3 damage to each of Ragatha's neighbors."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.dealDamage(() => ({
                    amount: 3,
                    target: this.neighbors
                }))
            })
        });
    }
}

Ragatha.id = 'ragatha';

module.exports = Ragatha;
