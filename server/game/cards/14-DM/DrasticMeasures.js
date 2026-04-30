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
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber({
                    amount: preThenContext.target ? preThenContext.target.length : 0
                })
            })
        });
    }
}

DrasticMeasures.id = 'drastic-measures';

module.exports = DrasticMeasures;
