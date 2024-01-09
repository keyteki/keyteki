const Card = require('../../Card.js');

class TriangulatorNewsome extends Card {
    // After Reap: If you are haunted, move each from Triangulator
    // Newsome’s neighbors to your pool.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isHaunted(),
            effect: "move each amber from {0}'s neighbors creatures to their pool",
            effectArgs: (context) => [context.source],
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

module.exports = TriangulatorNewsome;
