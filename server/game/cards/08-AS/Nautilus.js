const Card = require('../../Card.js');

class Nautilus extends Card {
    // Play/After Fight: Ward a creature. Draw a card.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.ward()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            }
        });
    }
}

Nautilus.id = 'nautilus';

module.exports = Nautilus;
