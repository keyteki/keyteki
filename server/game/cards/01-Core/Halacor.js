const Card = require('../../Card.js');

class Halacor extends Card {
    // Each friendly flank creature gains skirmish. (When you use a creature with skirmish to fight, it is dealt no damage in return.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.isOnFlank(),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

Halacor.id = 'halacor';

module.exports = Halacor;
