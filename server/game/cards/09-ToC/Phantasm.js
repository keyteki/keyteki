const Card = require('../../Card.js');

class Phantasm extends Card {
    // After Reap: Discard a card from your hand.
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

Phantasm.id = 'phantasm';

module.exports = Phantasm;
