const Card = require('../../Card.js');

class OzmoMartianologist extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Heal a Mars creature': () => true,
                        'Stun a Mars creature': () => true
                    }
                },
                creature: {
                    dependsOn: 'action',
                    cardType: 'creature',
                    cardCondition: (card) => card.hasHouse('mars'),
                    gameAction: [
                        ability.actions.heal((context) => ({
                            target:
                                context.selects.action.choice === 'Heal a Mars creature'
                                    ? context.targets.creature
                                    : [],
                            amount: 3
                        })),
                        ability.actions.stun((context) => ({
                            target:
                                context.selects.action.choice === 'Stun a Mars creature'
                                    ? context.targets.creature
                                    : []
                        }))
                    ]
                }
            }
        });
    }
}

OzmoMartianologist.id = 'ozmo-martianologist';

module.exports = OzmoMartianologist;
