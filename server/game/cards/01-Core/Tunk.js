const Card = require('../../Card.js');

class Tunk extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.hasHouse('mars') && event.player === context.player
            },
            gameAction: ability.actions.heal({ fully: true })
        });
    }
}

Tunk.id = 'tunk'; // This is a guess at what the id might be - please check it!!!

module.exports = Tunk;
