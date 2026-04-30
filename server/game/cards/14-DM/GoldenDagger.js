const Card = require('../../Card.js');

class GoldenDagger extends Card {
    // After Reap: Deal 3D to a creature. If this damage destroys that
    // creature, its owner gains 1A.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                message: '{0} uses {1} to make {2} gain 1 amber',
                messageArgs: (context) => [context.preThenEvent.card.owner],
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.preThenEvent.card.owner
                }))
            }
        });
    }
}

GoldenDagger.id = 'golden-dagger';

module.exports = GoldenDagger;
