const Card = require('../../Card.js');

class Dodger extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Dodger.id = 'dodger';

module.exports = Dodger;
