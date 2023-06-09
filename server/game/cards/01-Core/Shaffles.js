const Card = require('../../Card.js');

class Shaffles extends Card {
    // At the end of your turn, your opponent loses 1<A>.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Shaffles.id = 'shaffles';

module.exports = Shaffles;
