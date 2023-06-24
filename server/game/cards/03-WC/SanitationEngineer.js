const Card = require('../../Card.js');

class SanitationEngineer extends Card {
    // Hazardous 1. (Before this creature is attacked, deal 1D to the attacking enemy.)
    // Reap: Discard a card from your hand.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            }
        });
    }
}

SanitationEngineer.id = 'sanitation-engineer';

module.exports = SanitationEngineer;
