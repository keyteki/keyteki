const Card = require('../../Card.js');

class CapReigns extends Card {
    // Elusive.
    // Each enemy creature gains, "After Reap: Pay your opponent 1."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.transferAmber((context) => ({
                    amount: 1,
                    target: context.game.activePlayer
                }))
            })
        });
    }
}

CapReigns.id = 'cap-reigns';

module.exports = CapReigns;
