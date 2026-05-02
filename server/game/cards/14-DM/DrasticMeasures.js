const Card = require('../../Card.js');

class DrasticMeasures extends Card {
    // Play: Purge up to 2 cards from your hand. For each card purged this way,
    // gain 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 2,
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.purge()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: (context.preThenEvents || []).filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

DrasticMeasures.id = 'drastic-measures';

module.exports = DrasticMeasures;
