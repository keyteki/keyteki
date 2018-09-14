const Card = require('../../Card.js');

class Teliga extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'creature' && event.player !== context.player
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

Teliga.id = 'teliga'; // This is a guess at what the id might be - please check it!!!

module.exports = Teliga;
