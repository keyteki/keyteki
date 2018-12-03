const Card = require('../../Card.js');

class Vigor extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                creature: {
                    cardType: 'creature'
                },
                amount: {
                    mode: 'select',
                    dependsOn: 'creature',
                    choices: {
                        '0': ability.actions.heal(context => ({ amount: 0, target: context.targets.creature })),
                        '1': ability.actions.heal(context => ({ amount: 1, target: context.targets.creature })),
                        '2': ability.actions.heal(context => ({ amount: 2, target: context.targets.creature })),
                        '3': ability.actions.heal(context => ({ amount: 3, target: context.targets.creature })),
                    }
                }
            },
            then: {
                condition: context => context.preThenEvent.amount === 3,
                message: '{0} gains an additional amber due to {1} healing 3 damage',
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

Vigor.id = 'vigor'; // This is a guess at what the id might be - please check it!!!

module.exports = Vigor;
