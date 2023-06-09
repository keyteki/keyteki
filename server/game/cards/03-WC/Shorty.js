const Card = require('../../Card.js');

class Shorty extends Card {
    // Assault 4. (Before this creature attacks, deal 4D to the attacked enemy.)
    // Reap: Enrage Shorty.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.enrage()
        });
    }
}

Shorty.id = 'shorty';

module.exports = Shorty;
