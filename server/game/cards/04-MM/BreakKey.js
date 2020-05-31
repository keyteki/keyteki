const Card = require('../../Card.js');

class BreakKey extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.getForgedKeys() > context.player.getForgedKeys(),
            effect: 'cause {1} to unforge a key and gain 6 amber',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.unforgeKey((context) => ({
                target:
                    context.player.opponent &&
                    context.player.opponent.getForgedKeys() > context.player.getForgedKeys()
                        ? context.player.opponent
                        : [],
                choices:
                    Object.keys(context.player.opponent.keys).filter(
                        (key) => context.player.opponent.keys[key]
                    ) || []
            })),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: 6,
                    target: context.player.opponent
                }))
            }
        });
    }
}

BreakKey.id = 'break-key';

module.exports = BreakKey;
