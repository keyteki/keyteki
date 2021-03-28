const Card = require('../../Card.js');

class Tunk extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasHouse('mars') &&
                    event.card.type === 'creature' &&
                    event.player === context.player &&
                    event.card !== context.source
            },
            gameAction: ability.actions.heal({ fully: true })
        });
    }
}

Tunk.id = 'tunk';

module.exports = Tunk;
