const Card = require('../../Card.js');

class Turnkey extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.getForgedKeys() > 0,
            effect: 'cause {1} to unforge a key',
            effectArgs: (context) => context.player.opponent,
            gameAction: [
                ability.actions.unforgeKey((context) => ({
                    target:
                        context.player.opponent && context.player.opponent.getForgedKeys() > 0
                            ? context.player.opponent
                            : [],
                    choices:
                        Object.keys(context.player.opponent.keys).filter(
                            (key) => context.player.opponent.keys[key]
                        ) || []
                })),
                ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.delayedEffect({
                        when: { onCardLeavesPlay: (event) => event.card === context.source },
                        gameAction: ability.actions.forgeKey({
                            target: context.player.opponent,
                            modifier: -context.player.opponent.getCurrentKeyCost()
                        }),
                        message: '{0} forges a key due to {1} leaving play'
                    })
                }))
            ]
        });
    }
}

Turnkey.id = 'turnkey';

module.exports = Turnkey;
