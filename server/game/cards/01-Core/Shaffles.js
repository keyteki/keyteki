const Card = require('../../Card.js');

class Shaffles extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onEndPhase: (event, context) => event.phase === 'draw' && context.player.opponent === this.game.activePlayer
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Shaffles.id = 'shaffles'; // This is a guess at what the id might be - please check it!!!

module.exports = Shaffles;
