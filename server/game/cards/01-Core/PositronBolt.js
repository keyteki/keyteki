const Card = require('../../Card.js');

class PositronBolt extends Card {
    // Play: Deal 3<D> to a flank creature. Deal 2<D> to its neighbor. Deal 1<D> to the second creatures other neighbor.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                flank: {
                    cardType: 'creature',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: [
                        ability.actions.dealDamage({ amount: 3 }),
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.flank.neighbors,
                            amount: context.targets.flank.neighbors.length !== 1 ? 0 : 2
                        })),
                        ability.actions.dealDamage((context) => {
                            if (context.targets.flank.neighbors.length !== 1) {
                                return { amount: 0 };
                            }

                            return {
                                target: context.targets.flank.neighbors[0].neighbors.find(
                                    (card) => card !== context.targets.flank
                                ),
                                amount: 1
                            };
                        })
                    ]
                },
                neighbor: {
                    dependsOn: 'flank',
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        context.targets.flank.neighbors.length > 1
                            ? context.targets.flank.neighbors.includes(card)
                            : false,
                    gameAction: [
                        ability.actions.dealDamage({
                            amount: 2
                        }),
                        ability.actions.dealDamage((context) => {
                            if (
                                !context.targets.neighbor ||
                                context.targets.neighbor.neighbors.length === 0
                            ) {
                                return { amount: 0 };
                            }

                            return {
                                target: context.targets.neighbor.neighbors.find(
                                    (card) => card !== context.targets.flank
                                ),
                                amount: 1
                            };
                        })
                    ]
                }
            },
            effect: 'deal 3 damage to {1}{2}{3}{4}{5}',
            effectArgs: (context) => {
                let neighbors = context.targets.flank.neighbors;

                if (neighbors.length === 0) {
                    return [context.targets.flank, null, null, null, null];
                }

                let neighbor;
                if (neighbors.length === 1) {
                    neighbor = neighbors[0];
                } else {
                    neighbor = context.targets.neighbor;
                }

                if (neighbor.neighbors.length === 1) {
                    return [context.targets.flank, ' and 2 damage to ', neighbor, null, null];
                }

                return [
                    context.targets.flank,
                    ', 2 damage to ',
                    neighbor,
                    ' and 1 damage to ',
                    neighbor.neighbors.find((card) => card !== context.targets.flank)
                ];
            }
        });
    }
}

PositronBolt.id = 'positron-bolt';

module.exports = PositronBolt;
