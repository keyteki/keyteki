const Card = require('../../Card.js');

class BrillixPonder extends Card {
    // Scrap: Draw a card.
    setupCardAbilities(ability) {
        this.scrap({
            gameAction: ability.actions.draw()
        });
    }
}

BrillixPonder.id = 'brillix-ponder';

module.exports = BrillixPonder;
