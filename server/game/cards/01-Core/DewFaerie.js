const Card = require('../../Card.js');

class DewFaerie extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber()
        });
    }
}

DewFaerie.id = 'dew-faerie'; // This is a guess at what the id might be - please check it!!!

module.exports = DewFaerie;
