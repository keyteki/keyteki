const Card = require('../../Card.js');

class TradeBlows extends Card {
    // Play: Deal 1 to a friendly creature and 1 to an enemy creature. If that enemy creature is not destroyed, you may repeat this effect.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                },
                enemy: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                }
            },
            effect: 'deal 1 damage to {1}',
            effectArgs: (context) => [Object.values(context.targets)],
            then: (context) => ({
                alwaysTriggers: true,
                condition: () =>
                    context.targets.enemy && context.targets.enemy.location === 'play area',
                may: 'repeat this effect',
                gameAction: ability.actions.resolveAbility({ ability: context.ability })
            })
        });
    }
}

TradeBlows.id = 'trade-blows';

module.exports = TradeBlows;
