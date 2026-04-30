const Card = require('../../Card.js');

class SnapperDyn extends Card {
    // Entrench. At the end of your turn, if Snapper Dyn is exhausted,
    // deal 1 to an enemy creature for each amber in your opponent's pool.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) =>
                    context.player === this.game.activePlayer && context.source.exhausted
            },
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                }))
            },
            effect: 'deal {2} damage to {1}',
            effectArgs: (context) => [
                context.target,
                context.player.opponent ? context.player.opponent.amber : 0
            ]
        });
    }
}

SnapperDyn.id = 'snapper-dyn';

module.exports = SnapperDyn;
