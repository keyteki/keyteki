const Card = require('../../Card.js');

class FiendishApprentice extends Card {
    // Play: For each friendly Dis creature, deal 3D to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.allocateDamage((context) => ({
                cardCondition: (card, context) => card.controller !== context.player,
                damageStep: 3,
                numSteps: context.player.creaturesInPlay.filter((c) => c.hasHouse('dis')).length
            })),
            effect: 'to deal 3 damage to a creature for each friendly Dis creature ({1})',
            effectArgs: (context) => [
                context.player.creaturesInPlay.filter((c) => c.hasHouse('dis')).map((c) => c.name)
            ],
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

FiendishApprentice.id = 'fiendish-apprentice';

module.exports = FiendishApprentice;
