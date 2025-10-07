import Card from '../../Card.js';

class ChaosImp extends Card {
    // Destroyed: Your opponent loses 1A. If your opponent has no A, archive Chaos Imp.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: 1
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.controller.opponent &&
                    context.source.controller.opponent.amber === 0,
                gameAction: ability.actions.archive((context) => ({
                    target: context.source
                })),
                message: '{0} uses {1} to archive {1}'
            }
        });
    }
}

ChaosImp.id = 'chaos-imp';

export default ChaosImp;
