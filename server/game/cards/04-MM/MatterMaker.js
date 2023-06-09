const Card = require('../../Card.js');

class MatterMaker extends Card {
    // You may play upgrades as if they belonged to the active house.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canPlay((card) => card.type === 'upgrade')
        });
    }
}

MatterMaker.id = 'matter-maker';

module.exports = MatterMaker;
