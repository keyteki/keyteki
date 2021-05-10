const Card = require('../../Card.js');

class SpecialDelivery extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect: 'sacrifice {1} and deal 3 damage to {0}',
            effectArgs: (context) => context.source,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            gameAction: ability.actions.sacrifice(),
            then: (preThenContext) => ({
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.purge({ target: preThenContext.target }),
                message: '{0} uses {1} to purge {3}',
                messageArgs: () => [preThenContext.target]
            })
        });
    }
}

SpecialDelivery.id = 'special-delivery';

module.exports = SpecialDelivery;
