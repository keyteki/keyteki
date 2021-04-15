const Card = require('../../Card.js');

class BinaryMoray extends Card {
    // (T) After you raise the tide, ready Binary Moray.
    // (T) After your opponent raises the tide, exhaust Binary Moray.
    // Reap: Archive a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.ready((context) => ({
                target: context.source
            }))
        });

        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.source
            }))
        });

        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive({ location: 'hand' })
            }
        });
    }
}

BinaryMoray.id = 'binary-moray';

module.exports = BinaryMoray;
