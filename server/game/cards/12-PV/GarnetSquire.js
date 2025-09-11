const Card = require('../../Card.js');

class GarnetSquire extends Card {
    // Enhance DD.
    // At the end of your turn, heal 1D from Garnet Squire. If you do, gain 1A.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
            },
            condition: (context) => context.source.tokens.damage > 0,
            gameAction: ability.actions.heal({ amount: 1 }),
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

GarnetSquire.id = 'garnet-squire';

module.exports = GarnetSquire;
