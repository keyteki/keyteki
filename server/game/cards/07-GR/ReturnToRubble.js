const Card = require('../../Card.js');

class ReturnToRubble extends Card {
    // Play: Shuffle the top 10 cards of your discard pile into your
    // deck. If you do, destroy each creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: context.player.getDiscardSlice(10)
            })),
            then: {
                condition: (context) => context.preThenEvents.length === 10,
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay
                })),
                message: '{0} uses {1} to destroy each creature'
            }
        });
    }
}

ReturnToRubble.id = 'return-to-rubble';

module.exports = ReturnToRubble;
