const Card = require('../../Card.js');

class Shorty extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.enrage()
        });
    }
}

Shorty.id = 'shorty';

module.exports = Shorty;
