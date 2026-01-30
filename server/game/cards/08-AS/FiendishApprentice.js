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
                message: '{0} uses {1} to deal 3 damage to {3}',
                messageArgs: (context) => [
                    context.preThenEvents
                        .filter((event) => !event.cancelled && event.amount > 0)
                        .map((event) => event.card.name)
                ]
            }
        });
    }
}

FiendishApprentice.id = 'fiendish-apprentice';

module.exports = FiendishApprentice;
