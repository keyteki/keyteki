import Card from '../../Card.js';

class BinaryMoray extends Card {
    // (T) After you raise the tide, ready Binary Moray.
    // (T) After your opponent raises the tide, exhaust Binary Moray.
    // Reap: Archive a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.ready()
        });

        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.exhaust()
        });

        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive()
            }
        });
    }
}

BinaryMoray.id = 'binary-moray';

export default BinaryMoray;
