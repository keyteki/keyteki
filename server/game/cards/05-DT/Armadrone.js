const Card = require('../../Card.js');

class Armadrone extends Card {
    // Fight: Steal 1A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

Armadrone.id = 'armadrone';

module.exports = Armadrone;
