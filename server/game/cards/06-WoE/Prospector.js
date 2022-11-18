const Card = require('../../Card.js');

class Prospector extends Card {
    //Destroyed: Draw a card.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.draw({ amount: 1 })
        });
    }
}

Prospector.id = 'prospector';

module.exports = Prospector;
