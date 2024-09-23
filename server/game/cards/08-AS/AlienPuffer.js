const Card = require('../../Card.js');

class AlienPuffer extends Card {
    // Destroyed: Gain 2A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

AlienPuffer.id = 'alien-puffer';

module.exports = AlienPuffer;
