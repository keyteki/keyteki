const Card = require('../../Card.js');

class CarloPhantom extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'artifact' && event.player === context.player
            },
            gameAction: ability.actions.steal()
        });
    }
}

CarloPhantom.id = 'carlo-phantom'; // This is a guess at what the id might be - please check it!!!

module.exports = CarloPhantom;
