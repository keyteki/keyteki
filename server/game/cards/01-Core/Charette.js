const Card = require('../../Card.js');

class Charette extends Card {
    // Play: Capture 3A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
    }
}

Charette.id = 'charette';

module.exports = Charette;
