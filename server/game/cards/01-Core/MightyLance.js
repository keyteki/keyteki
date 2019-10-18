const Card = require('../../Card.js');

class MightyLance extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                initial: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                },
                secondary: {
                    dependsOn: 'initial',
                    cardType: 'creature',
                    cardCondition: (card, context) => context.targets.initial.neighbors.includes(card),
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                }
            },
            effect: 'deal 3 damage to {1} and {2}',
            effectArgs: context => Object.values(context.targets)
        });
    }
}

MightyLance.id = 'mighty-lance';

module.exports = MightyLance;
