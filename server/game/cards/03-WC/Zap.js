const Card = require('../../Card.js');

class Zap extends Card {
    // Play: Deal 1 to a creature for each house represented among creatures in play.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a creature for each house represented among creatures in play',
            gameAction: ability.actions.allocateDamage((context) => ({
                numSteps: context.game.getHousesInPlay(context.game.creaturesInPlay).length
            })),
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
Zap.id = 'zap';

module.exports = Zap;
