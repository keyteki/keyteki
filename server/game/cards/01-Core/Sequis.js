const Card = require('../../Card.js');

class Sequis extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture()
        });
    }
}

Sequis.id = 'sequis'; // This is a guess at what the id might be - please check it!!!

module.exports = Sequis;
