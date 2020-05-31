const Card = require('../../Card.js');

class DirectorOfZyx extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'key' && context.player === this.game.activePlayer
            },
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck[0]
            }))
        });
    }
}

DirectorOfZyx.id = 'director-of-zyx';

module.exports = DirectorOfZyx;
