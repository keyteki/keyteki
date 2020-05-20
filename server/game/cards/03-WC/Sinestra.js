const Card = require('../../Card.js');

class Sinestra extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.isOnFlank('left')
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Sinestra.id = 'sinestra';

module.exports = Sinestra;
