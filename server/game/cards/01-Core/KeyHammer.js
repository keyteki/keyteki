const Card = require('../../Card.js');

class KeyHammer extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'cause {1} to gain 6 amber',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.gainAmber(context => ({
                amount: 6,
                target: context.player.opponent
            })),
            then: {
                gameAction: ability.actions.unforgeKey(context => ({
                    target: context.player.opponent && context.player.opponent.keyForged.length > 0 ? context.player.opponent : [],
                    choices: context.player.opponent.keyForged || []
                }))
            }
        });
    }
}

KeyHammer.id = 'key-hammer'; // This is a guess at what the id might be - please check it!!!

module.exports = KeyHammer;
