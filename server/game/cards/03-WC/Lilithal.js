const Card = require('../../Card.js');

class Lilithal extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.capture()
        });
    }
}

Lilithal.id = 'lilithal';

module.exports = Lilithal;
