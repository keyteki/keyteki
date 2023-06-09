const Card = require('../../Card.js');

class Sequis extends Card {
    // Reap: Capture 1<A>.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture()
        });
    }
}

Sequis.id = 'sequis';

module.exports = Sequis;
