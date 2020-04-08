const Card = require('../../Card.js');

class KeyFrog extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.forgeKey()
        });
    }
}

KeyFrog.id = 'key-frog';

module.exports = KeyFrog;
