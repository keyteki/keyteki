const Card = require('../../Card.js');

class SnapperDyn extends Card {
    // Entrench.
    // At the end of your turn, if Snapper Dyn is exhausted, deal 1 damage to an enemy creature for each amber in your opponent's pool.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            condition: (context) => context.source.exhausted,
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps: context.player.opponent ? context.player.opponent.amber : 0
            })),
            effect: "deal 1 damage to an enemy creature for each amber in their opponent's pool"
        });
    }
}

SnapperDyn.id = 'snapper-dyn';

module.exports = SnapperDyn;
