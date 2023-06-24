const Card = require('../../Card.js');

class CustomsOffice extends Card {
    // Your opponent must pay you 1A in order to play an artifact.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.additionalCost((context) => {
                if (context.source.type === 'artifact' && context.ability.isCardPlayed()) {
                    return ability.costs.payAmber();
                }
            })
        });
    }
}

CustomsOffice.id = 'customs-office';

module.exports = CustomsOffice;
