const Card = require('../../Card.js');

class SackOfCoins extends Card {
    // Play: Deal 1D to a creature for each
    // A in your pool.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a creature for each amber in their pool',
            gameAction: ability.actions.allocateDamage((context) => ({
                numSteps: context.player.amber || 0
            }))
        });
    }
}

SackOfCoins.id = 'sack-of-coins';

module.exports = SackOfCoins;
