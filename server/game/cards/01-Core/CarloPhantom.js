const Card = require('../../Card.js');

class CarloPhantom extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'artifact' && event.player === context.player
            },
            gameAction: ability.actions.steal()
        });
    }
}

CarloPhantom.id = 'carlo-phantom';

module.exports = CarloPhantom;
