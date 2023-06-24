const Card = require('../../Card.js');

class Yurk extends Card {
    // Play: Choose and discard a card from your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            }
        });
    }
}

Yurk.id = 'yurk';

module.exports = Yurk;
