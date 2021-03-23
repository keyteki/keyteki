const Card = require('../../Card.js');

class OzmoMartianologist extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            condition: (context) =>
                context.game.creaturesInPlay.some((card) => card.hasHouse('mars')),
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Heal a Mars creature': () => true,
                        'Stun a Mars creature': () => true
                    }
                },
                'Heal a Mars creature': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    cardCondition: (card) => card.hasHouse('mars'),
                    gameAction: ability.actions.heal({ amount: 3 })
                },
                'Stun a Mars creature': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    cardCondition: (card) => card.hasHouse('mars'),
                    gameAction: ability.actions.stun()
                }
            }
        });
    }
}

OzmoMartianologist.id = 'ozmo-martianologist';

module.exports = OzmoMartianologist;
