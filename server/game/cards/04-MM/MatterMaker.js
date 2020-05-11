const Card = require('../../Card.js');

class MatterMaker extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canPlay((card, context, abilityType) => abilityType === 'upgrade' && card.canPlayAsUpgrade())
        });
    }
}

MatterMaker.id = 'matter-maker';

module.exports = MatterMaker;
