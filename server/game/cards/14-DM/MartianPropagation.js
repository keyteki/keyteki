const Card = require('../../Card.js');

class MartianPropagation extends Card {
    // Play: Destroy each friendly creature. For each creature destroyed this way, draw 2 cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    amount: 2 * context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

MartianPropagation.id = 'martian-propagation';

module.exports = MartianPropagation;
