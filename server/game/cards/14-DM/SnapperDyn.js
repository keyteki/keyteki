const Card = require('../../Card.js');

class SnapperDyn extends Card {
    // Entrench.
    // At the end of your turn, if Snapper Dyn is exhausted, deal 1 damage to an enemy creature for each amber in your opponent's pool.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) =>
                    context.player === this.game.activePlayer && context.source.exhausted
            },
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps: context.player.opponent ? context.player.opponent.amber : 0
            })),
            effect: "deal 1 damage to an enemy creature for each amber in their opponent's pool",
            then: {
                alwaysTriggers: true,
                condition: (context) => {
                    context.preThenEvents
                        .filter((event) => !event.cancelled && event.amount > 0)
                        .forEach((event) => {
                            context.game.addMessage(
                                '{0} uses {1} to deal {2} damage to {3}',
                                context.player,
                                context.source,
                                event.amount,
                                event.card
                            );
                        });
                    return false;
                }
            }
        });
    }
}

SnapperDyn.id = 'snapper-dyn';

module.exports = SnapperDyn;
