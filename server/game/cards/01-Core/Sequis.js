const Card = require('../../Card.js');

class Sequis extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture()
        });
    }
}

Sequis.id = 'sequis';

module.exports = Sequis;
