const Card = require('../../Card.js');

class CollectorBoren extends Card {
    // Play: Put an upgrade from your disard pile into your hand.
    //
    // After an upgrade is attached to Collector Boren, ready
    // Collector Boren.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: ['discard'],
                controller: 'self',
                cardCondition: (card) => card.type === 'upgrade',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });

        this.reaction({
            when: {
                onCardAttached: (event, context) => event.card.parent === context.source
            },
            gameAction: ability.actions.ready()
        });
    }
}

CollectorBoren.id = 'collector-boren';

module.exports = CollectorBoren;
