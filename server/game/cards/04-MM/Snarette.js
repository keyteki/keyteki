const Card = require('../../Card.js');

class Snarette extends Card {
    // At the end of your turn, capture 1A.
    // Action: Move each A from Snarette to the common supply.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.capture({ amount: 1 })
        });

        this.action({
            condition: (context) => context.source.hasToken('amber'),
            effect: 'move {1} amber from Snarette to the common pool',
            effectArgs: (context) => context.source.amber,
            gameAction: ability.actions.removeAmber({
                all: true
            })
        });
    }
}

Snarette.id = 'snarette';

module.exports = Snarette;
