const Card = require('../../Card.js');

class BreakKey extends Card {
    // Play: If your opponent has more forged keys than you, unforge an opponents key. If you unforge an opponents key this way, your opponent gains 6A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.getForgedKeys() > context.player.getForgedKeys(),
            effect: 'cause {1} to unforge a key and gain 6 amber',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.unforgeKey(),
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
