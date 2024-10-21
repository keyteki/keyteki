const Card = require('../../Card.js');

class Spydrone extends Card {
    // Action: Draw a card.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw()
        });
    }
}

Spydrone.id = 'spydrone';

module.exports = Spydrone;
