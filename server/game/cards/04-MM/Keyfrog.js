const Card = require('../../Card.js');

class Keyfrog extends Card {
    // Destroyed: Forge a key at current cost.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.forgeKey()
        });
    }
}

Keyfrog.id = 'keyfrog';

module.exports = Keyfrog;
