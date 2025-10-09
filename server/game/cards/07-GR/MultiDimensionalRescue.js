const Card = require('../../Card.js');

class MultiDimensionalRescue extends Card {
    // Play: Return one card of each type (action, artifact, creature,
    // upgrade) from your discard pile to your hand. For the remainder
    // of the turn, you may play a non-Star Alliance card. Purge
    // Multi-Dimensional Rescue.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    cardType: 'action',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                },
                artifact: {
                    cardType: 'artifact',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                },
                creature: {
                    cardType: 'creature',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                },
                upgrade: {
                    cardType: 'upgrade',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                }
            },
            effect:
                'return {1} to their hand, play one non-Star Alliance card this turn, and purge {0}',
            effectArgs: (context) => [Object.values(context.targets)],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.untilEndOfPlayerTurn({
                    effect: ability.effects.canPlayNonHouse('staralliance')
                }),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.purge((context) => ({
                        target: context.source
                    }))
                }
            }
        });
    }
}

MultiDimensionalRescue.id = 'multi-dimensional-rescue';

module.exports = MultiDimensionalRescue;
