const Card = require('../../Card.js');

class GrowthSurge extends Card {
    // Play: Give a flank creature three +1 power counters. Give its neighbor two +1 power counters. Give the second creature's other neighbor a +1 power counter.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                flank: {
                    cardType: 'creature',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: [
                        ability.actions.addPowerCounter({ amount: 3 }),
                        ability.actions.addPowerCounter((context) => ({
                            target: context.targets.flank.neighbors,
                            amount: context.targets.flank.neighbors.length !== 1 ? 0 : 2
                        })),
                        ability.actions.addPowerCounter((context) => {
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
                        ability.actions.addPowerCounter({
                            amount: 2
                        }),
                        ability.actions.addPowerCounter((context) => {
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
            effect: 'add 3 power counters to to {1}{2}{3}{4}{5}',
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
                    return [
                        context.targets.flank,
                        ' and 2 power counters to ',
                        neighbor,
                        null,
                        null
                    ];
                }

                return [
                    context.targets.flank,
                    ', 2 power counters to ',
                    neighbor,
                    ' and 1 power counter to ',
                    neighbor.neighbors.find((card) => card !== context.targets.flank)
                ];
            }
        });
    }
}

GrowthSurge.id = 'growth-surge';

module.exports = GrowthSurge;
