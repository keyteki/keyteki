const Card = require('../../Card.js');

class Snarette extends Card {
    // At the end of your turn, capture 1A.
    // Action: Move each A from Snarette to the common supply.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.capture({ amount: 1 })
        });

        this.action({
            condition: (context) => context.source.hasToken('amber'),
            effect: 'move all amber from Snarette to the common pool',
            gameAction: ability.actions.removeAmber({
                all: true
            })
        });
    }
}

Snarette.id = 'snarette';

module.exports = Snarette;
