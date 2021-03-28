const Card = require('../../Card.js');

class Grovekeeper extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addPowerCounter(() => ({ target: this.neighbors }))
        });
    }
}

Grovekeeper.id = 'grovekeeper';

module.exports = Grovekeeper;
