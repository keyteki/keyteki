import Card from '../../Card.js';

class TradeBlows extends Card {
    // Play: Deal 1 to an enemy creature. If that creature is not destroyed, you may deal 1 to a friendly creature to repeat this effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () =>
                    preThenContext.target && preThenContext.target.location === 'play area',
                target: {
                    optional: true,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                },
                message: '{0} uses {1} to deal 1 damage to {3}',
                messageArgs: (context) => [context.target],
                then: {
                    gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
                }
            })
        });
    }
}

TradeBlows.id = 'trade-blows';

export default TradeBlows;
