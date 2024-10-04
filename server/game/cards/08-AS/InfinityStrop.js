const Card = require('../../Card.js');

class InfinityStrop extends Card {
    // Play: Play: Deal 2D to a creature. If this damage destroys that
    // creature, deal 4D to each creature that shares a house with the
    // destroyed creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay.filter((c) =>
                        c.getHouses().some((house) => context.preThenEvent.clone.hasHouse(house))
                    ),
                    amount: 4
                })),
                message:
                    '{0} uses {1} to deal 4 damage to each creature that shares a house with {3}',
                messageArgs: (context) => [context.preThenEvent.clone]
            }
        });
    }
}

InfinityStrop.id = 'infinity-strop';

module.exports = InfinityStrop;
