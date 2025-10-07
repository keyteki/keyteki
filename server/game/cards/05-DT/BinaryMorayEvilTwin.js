import Card from '../../Card.js';

class BinaryMorayEvilTwin extends Card {
    // Skirmish.
    // (T) After you raise the tide, ready Binary Moray.
    // (T) After your opponent raises the tide, exhaust Binary Moray.
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
    }
}

BinaryMorayEvilTwin.id = 'binary-moray-evil-twin';

export default BinaryMorayEvilTwin;
