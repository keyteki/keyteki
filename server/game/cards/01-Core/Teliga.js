const Card = require('../../Card.js');

class Teliga extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' && event.player !== context.player
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

Teliga.id = 'teliga';

module.exports = Teliga;
