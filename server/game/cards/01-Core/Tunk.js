const Card = require('../../Card.js');

class Tunk extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasHouse('mars') && event.card.type === 'creature' &&
                    event.player === context.player && event.card !== context.source
            },
            gameAction: ability.actions.heal({ fully: true })
        });
    }
}

Tunk.id = 'tunk'; // This is a guess at what the id might be - please check it!!!

module.exports = Tunk;
