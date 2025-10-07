import Card from '../../Card.js';

class RoseOfSharon extends Card {
    // Action: Choose one of Rose of Sharon’s neighbors. Deal damage
    // to an enemy creature equal to that neighbor’s power. If your
    // red key is forged, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.action({
            targets: {
                neighbor: {
                    controller: 'self',
                    cardType: 'creature',
                    cardCondition: (card, context) => context.source.neighbors.includes(card)
                },
                enemy: {
                    dependsOn: 'neighbor',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.neighbor ? context.targets.neighbor.getPower() : 0
                    }))
                }
            },
            then: {
                condition: (context) => context.player.keys.red,
                alwaysTriggers: true,
                targets: {
                    neighbor2: {
                        controller: 'self',
                        cardType: 'creature',
                        cardCondition: (card, context) => context.source.neighbors.includes(card)
                    },
                    enemy2: {
                        dependsOn: 'neighbor2',
                        cardType: 'creature',
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage((context) => ({
                            amount: context.targets.neighbor2
                                ? context.targets.neighbor2.getPower()
                                : 0
                        }))
                    }
                },
                message: '{0} uses {1} to repeat the preceding effect and deal {3} damage to {4}',
                messageArgs: (context) => [
                    context.targets.neighbor2 ? context.targets.neighbor2.getPower() : 0,
                    context.targets.enemy2
                ]
            }
        });
    }
}

RoseOfSharon.id = 'rose-of-sharon';

export default RoseOfSharon;
