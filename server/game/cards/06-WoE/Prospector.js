const TokenCard = require('../../TokenCard.js');

class Prospector extends TokenCard {
    //Destroyed: Draw a card.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.draw()
        });
    }
}

Prospector.id = 'prospector';

module.exports = Prospector;
