const Card = require('../../Card.js');

class Dexus extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.isOnFlank('right')
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Dexus.id = 'dexus';

module.exports = Dexus;
