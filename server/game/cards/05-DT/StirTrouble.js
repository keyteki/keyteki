const Card = require('../../Card.js');

class StirTrouble extends Card {
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
                },
                gameAction: ability.actions.dealDamage({
                    amountForCard: (card, context) => {
                        if (context.targets && context.targets.c1 && context.targets.c2) {
                            return card === context.targets.c1
                                ? context.targets.c2.power
                                : context.targets.c1.power;
                        }
                        return 0;
                    }
                })
            }
        });
    }
}

StirTrouble.id = 'stir-trouble';

module.exports = StirTrouble;
