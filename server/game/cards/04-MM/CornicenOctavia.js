const Card = require('../../Card.js');

class CornicenOctavia extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

CornicenOctavia.id = 'cornicen-octavia';

module.exports = CornicenOctavia;
