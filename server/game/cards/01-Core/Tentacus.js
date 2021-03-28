const Card = require('../../Card.js');

class Tentacus extends Card {
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
