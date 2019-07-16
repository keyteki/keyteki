const Card = require('../../Card.js');

class Umbra extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Umbra.id = 'umbra';

module.exports = Umbra;
