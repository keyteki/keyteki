const Card = require('../../Card.js');

class Shaffles extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) => event.phase === 'draw' && context.player.opponent === this.game.activePlayer
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Shaffles.id = 'shaffles';

module.exports = Shaffles;
