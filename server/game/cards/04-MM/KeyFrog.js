const Card = require('../../Card.js');

class Keyfrog extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.forgeKey()
        });
    }
}

Keyfrog.id = 'keyfrog';

module.exports = Keyfrog;
