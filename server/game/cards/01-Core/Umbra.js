const Card = require('../../Card.js');

class Umbra extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Fight: Steal 1A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Umbra.id = 'umbra';

module.exports = Umbra;
