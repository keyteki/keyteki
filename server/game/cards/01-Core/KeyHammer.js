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
                gameAction: ability.actions.unforgeKey((context) => {
                    let keysToUnforge = context.player.opponent.keysForgedThisRound.filter(
                        (key) => !!context.player.opponent.keys[key]
                    );
                    return {
                        target:
                            context.player.opponent && keysToUnforge.length > 0
                                ? context.player.opponent
                                : [],
                        choices: keysToUnforge
                    };
                })
            }
        });
    }
}

KeyHammer.id = 'key-hammer';

module.exports = KeyHammer;
