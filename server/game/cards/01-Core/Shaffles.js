const Card = require('../../Card.js');

class Shaffles extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                atEndOfTurn: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Shaffles.id = 'shaffles';

module.exports = Shaffles;
