import Card from '../../Card.js';

class BombArang extends Card {
    // Play: Deal 3D to an enemy creature.  If that creature is not
    // destroyed, deal 1D to a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvent &&
                    (!context.preThenEvent.destroyEvent ||
                        !context.preThenEvent.destroyEvent.destroyedByDamageDealt ||
                        context.preThenEvent.destroyEvent.cancelled),
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                },
                message: '{0} uses {1} to deal 1 damage to {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

BombArang.id = 'bomb-arang';

export default BombArang;
