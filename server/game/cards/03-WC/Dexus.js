const Card = require('../../Card.js');

class Dexus extends Card {
    // After your opponent plays a creature on their right flank, they lose 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    context.event.putIntoPlayEvent &&
                    context.event.putIntoPlayEvent.playedOnRightFlank
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Dexus.id = 'dexus';

module.exports = Dexus;
