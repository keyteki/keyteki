const Card = require('../../Card.js');

class DewFaerie extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber()
        });
    }
}

DewFaerie.id = 'dew-faerie';

module.exports = DewFaerie;
