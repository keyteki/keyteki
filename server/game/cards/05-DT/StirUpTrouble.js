import Card from '../../Card.js';

class StirUpTrouble extends Card {
    // Play: Choose a creature and 1 of its neighbors. Each chosen creature deals damage equal to its power to the other.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                c1: {
                    cardType: 'creature'
                },
                c2: {
                    dependsOn: 'c1',
                    cardType: 'creature',
                    cardCondition: (card, context) => card.neighbors.includes(context.targets.c1)
                }
            },
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    target: context.targets.c1,
                    damageSource: context.targets.c2,
                    amount: context.targets && context.targets.c2 ? context.targets.c2.power : 0
                })),
                ability.actions.dealDamage((context) => ({
                    target: context.targets.c2,
                    damageSource: context.targets.c1,
                    amount: context.targets && context.targets.c1 ? context.targets.c1.power : 0
                }))
            ]
        });
    }
}

StirUpTrouble.id = 'stir-up-trouble';

export default StirUpTrouble;
