import Card from '../../Card.js';

class TriangulatorNewsome extends Card {
    // After Reap: If you are haunted, move each from Triangulator
    // Newsome’s neighbors to your pool.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isHaunted(),
            effect: "move all {2} amber from {0}'s neighbors ({3}) to their pool",
            effectArgs: (context) => [
                context.source,
                context.source.neighbors.reduce((total, card) => total + card.amber, 0),
                context.source.neighbors
            ],
            gameAction: [
                ability.actions.removeAmber((context) => ({
                    all: true,
                    target: context.source.neighbors
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.source.neighbors.reduce((total, card) => total + card.amber, 0)
                }))
            ]
        });
    }
}

TriangulatorNewsome.id = 'triangulator-newsome';

export default TriangulatorNewsome;
