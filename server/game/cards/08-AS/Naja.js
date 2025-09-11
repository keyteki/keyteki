const Card = require('../../Card.js');

class Naja extends Card {
    // After Reap: Gain 3A.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber({ amount: 3 })
        });
    }
}

Naja.id = 'naja';

module.exports = Naja;
