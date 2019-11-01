const Card = require('../../Card.js');

class SpecialDelivery extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                cardCondition: card => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 3, purge: true })
            },
            effect: 'sacrifice {1} and deal 3 damage to {0}',
            effectArgs: context => context.source,
            gameAction: ability.actions.sacrifice()
        });
    }
}

SpecialDelivery.id = 'special-delivery';

module.exports = SpecialDelivery;
