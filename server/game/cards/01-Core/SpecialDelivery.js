const Card = require('../../Card.js');

class SpecialDelivery extends Card {
    // Omni: Sacrifice Special Delivery. Deal 3D to a flank creature. If this damage destroys that creature, purge it.
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
                condition: (context) => {
                    let dealDamageEvent = context.preThenEvents.find(
                        (event) => event.card === preThenContext.target
                    );
                    return (
                        dealDamageEvent.destroyEvent &&
                        dealDamageEvent.destroyEvent.destroyedByDamageDealt &&
                        dealDamageEvent.destroyEvent.resolved &&
                        dealDamageEvent.card.location === 'discard'
                    );
                },
                gameAction: ability.actions.purge({ target: preThenContext.target }),
                message: '{0} uses {1} to purge {3}',
                messageArgs: () => [preThenContext.target]
            })
        });
    }
}

SpecialDelivery.id = 'special-delivery';

module.exports = SpecialDelivery;
