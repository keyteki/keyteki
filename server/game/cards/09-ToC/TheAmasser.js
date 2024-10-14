const Card = require('../../Card.js');

class TheAmasser extends Card {
    // Each time your opponent draws a card, make a token creature on
    // your right flank.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.to === 'hand' &&
                    event.drawn &&
                    event.card.owner !== context.source.controller
            },
            gameAction: ability.actions.makeTokenCreature({
                deployIndex: -2 // Right flank
            })
        });
    }
}

TheAmasser.id = 'the-amasser';

module.exports = TheAmasser;
