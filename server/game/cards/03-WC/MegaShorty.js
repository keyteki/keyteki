const Card = require('../../Card.js');

class MegaShorty extends Card {
    // Assault 4. (Before this creature attacks, deal 4D to the attacked enemy.)
    // Reap: Enrage Mega Shorty.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.enrage()
        });
    }
}

MegaShorty.id = 'mega-shorty';

module.exports = MegaShorty;
