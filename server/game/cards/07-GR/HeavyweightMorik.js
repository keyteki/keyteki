const Card = require('../../Card.js');

class HeavyweightMorik extends Card {
    // Scrap: Deal 2 to a friendly creature and 2 to an enemy
    // creature.
    setupCardAbilities(ability) {
        this.scrap({
            targets: {
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            },
            effect: 'deal 2 damage to {1}',
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

HeavyweightMorik.id = 'heavyweight-morik';

module.exports = HeavyweightMorik;
