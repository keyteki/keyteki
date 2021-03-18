const Card = require('../../Card.js');

class BinaryMorayEvilTwin extends Card {
    //Skirmish.
    //When you raise the tide, ready Binary Moray.
    //When your opponent raises the tide, exhaust Binary Moray.
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

module.exports = BinaryMorayEvilTwin;
