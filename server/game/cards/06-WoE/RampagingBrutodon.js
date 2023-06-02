const Card = require('../../Card.js');

class RampagingBrutodon extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'self',
            effect: ability.effects.additionalCost((context) => {
                if (context.source === this) {
                    return ability.costs.destroyFriendlyCreature();
                }
            })
        });
    }
}

RampagingBrutodon.id = 'rampaging-brutodon';

module.exports = RampagingBrutodon;
