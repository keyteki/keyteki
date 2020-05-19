const Card = require('../../Card.js');

class PositronBolt extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                first: {
                    cardType: 'creature',
                    cardCondition: (card) => card.isOnFlank()
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        context.targets.first && context.targets.first.neighbors.includes(card)
                },
                third: {
                    dependsOn: 'second',
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        context.targets.second &&
                        context.targets.second.neighbors.includes(card) &&
                        card !== context.targets.first,
                    gameAction: ability.actions.sequential([
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.first,
                            amount: 3
                        })),
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.second,
                            amount: 2
                        })),
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.third,
                            amount: 1
                        }))
                    ])
                }
            }
        });
    }
}

PositronBolt.id = 'positron-bolt';

module.exports = PositronBolt;
