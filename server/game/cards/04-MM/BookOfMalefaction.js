const Card = require('../../Card.js');

class BookOfMalefaction extends Card {
    // After your A is stolen, put a warrant counter on Book of Malefaction for each A stolen.
    // Omni: Remove a warrant counter from Book of Malefaction. If you do, purge a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onStealAmber: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.addWarrantCounter((context) => ({
                target: context.source,
                amount: context.event.amount
            }))
        });
        this.omni({
            gameAction: ability.actions.removeWarrantCounter(),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

BookOfMalefaction.id = 'book-of-malefaction';

module.exports = BookOfMalefaction;
