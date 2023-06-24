const Card = require('../../Card.js');

class AncientYurk extends Card {
    // Play: Choose and discard 3cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                mode: 'exactly',
                location: 'hand',
                numCards: 3,
                gameAction: ability.actions.discard()
            }
        });
    }
}

AncientYurk.id = 'ancient-yurk';

module.exports = AncientYurk;
