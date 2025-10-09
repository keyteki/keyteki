const Card = require('../../Card.js');

class MalifiDragon extends Card {
    // At the end your turn, if you have 4A or fewer, gain 2A.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnded: (event, context) =>
                    context.player === this.game.activePlayer && context.player.amber <= 4
            },
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

MalifiDragon.id = 'malifi-dragon';

module.exports = MalifiDragon;
