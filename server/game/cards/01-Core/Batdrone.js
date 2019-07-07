const Card = require('../../Card.js');

class Batdrone extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Batdrone.id = 'batdrone';

module.exports = Batdrone;
