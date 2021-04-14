const Card = require('../../Card.js');

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
            gameAction: ability.actions.dealDamage((context) => ({
                target: Object.values(context.targets),
                amountForCard: (card, context) => {
                    if (context.targets && context.targets.c1 && context.targets.c2) {
                        return card === context.targets.c1
                            ? context.targets.c2.power
                            : context.targets.c1.power;
                    }
                    return 0;
                }
            }))
        });
    }
}

StirUpTrouble.id = 'stir-up-trouble';

module.exports = StirUpTrouble;
