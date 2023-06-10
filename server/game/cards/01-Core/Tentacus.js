const Card = require('../../Card.js');

class Tentacus extends Card {
    // Your opponent must pay you 1A in order to use an artifact.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.additionalCost((context) => {
                if (
                    context.source.type === 'artifact' &&
                    context.ability.isTriggeredAbility() &&
                    context.ability.isAction()
                ) {
                    return ability.costs.payAmber();
                }
            })
        });
    }
}

Tentacus.id = 'tentacus';

module.exports = Tentacus;
