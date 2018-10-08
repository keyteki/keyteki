const Card = require('../../Card.js');

class KeyHammer extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.opponent.keyForged,
            gameAction: [
                ability.actions.unforgeKey(),
                ability.actions.gainAmber(context => ({
                    amount: 6,
                    target: context.player.opponent
                }))
            ]
        });
    }
}

KeyHammer.id = 'key-hammer'; // This is a guess at what the id might be - please check it!!!

module.exports = KeyHammer;
