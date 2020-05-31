const Card = require('../../Card.js');

class TheFloorIsLava extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'key' && context.player === this.game.activePlayer
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
