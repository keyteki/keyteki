const Card = require('../../Card.js');

class SafePort extends Card {
    // Play: If your yellow key is forged, a friendly creature
    // captures 2A. If your opponent’s yellow key is forged, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture((context) => ({
                    amount: context.player.keys.yellow ? 2 : 0
                }))
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.opponent && context.player.opponent.keys.yellow,
                gameAction: ability.actions.steal(),
                message: '{0} uses {1} to steal 1 amber from {3}',
                messageArgs: (context) => [context.player.opponent]
            }
        });
    }
}

SafePort.id = 'safe-port';

module.exports = SafePort;
