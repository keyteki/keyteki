const Card = require('../../Card.js');

class CarloPhantom extends Card {
    // Elusive. Skirmish.
    // Each time you play an artifact, steal 1<A>.
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
