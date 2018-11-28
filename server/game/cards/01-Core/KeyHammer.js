const Card = require('../../Card.js');

class KeyHammer extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.unforgeKey(context => ({
                    target: context.player.opponent && context.player.opponent.keyForged ? context.player.opponent : []
                })),
                ability.actions.gainAmber(context => ({
                    amount: 6,
                    target: context.player.opponent || []
                }))
            ]
        });
    }
}

KeyHammer.id = 'key-hammer'; // This is a guess at what the id might be - please check it!!!

module.exports = KeyHammer;
