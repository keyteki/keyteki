const Card = require('../../Card.js');

class TheFloorIsLava extends Card {
    // At the start of your turn, deal 1D to a friendly creature and 1D to an enemy creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
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
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

TheFloorIsLava.id = 'the-floor-is-lava';

module.exports = TheFloorIsLava;
