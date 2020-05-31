const Card = require('../../Card.js');

class KeyHammer extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'cause {1} to gain 6 amber',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: 6,
                target: context.player.opponent
            })),
            then: {
                gameAction: ability.actions.unforgeKey((context) => ({
                    target:
                        context.player.opponent &&
                        context.player.opponent.keysForgedThisRound.length > 0
                            ? context.player.opponent
                            : [],
                    choices: context.player.opponent.keysForgedThisRound || []
                }))
            }
        });
    }
}

KeyHammer.id = 'key-hammer';

module.exports = KeyHammer;
