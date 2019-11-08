const Card = require('../../Card.js');

class MegaShorty extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.enrage()
        });
    }
}

MegaShorty.id = 'mega-shorty';

module.exports = MegaShorty;
