const Card = require('../../Card.js');

class TechnoKnight extends Card {
    // Reap: Discard a card from your hand. If you do, draw a card.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

TechnoKnight.id = 'techno-knight';

module.exports = TechnoKnight;
