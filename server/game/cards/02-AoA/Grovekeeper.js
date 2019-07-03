const Card = require('../../Card.js');

class Grovekeeper extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) => event.phase === 'draw' && context.player.opponent === this.game.activePlayer
            },
            gameAction: ability.actions.addPowerCounter(() => ({ target: this.neighbors }))
        });
    }
}

Grovekeeper.id = 'grovekeeper';

module.exports = Grovekeeper;
