const Card = require('../../Card.js');

class Dysania extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'discard all cards in {1}\'s archives, and gain {2} amber',
            effectArgs: context => [context.player.opponent, context.player.opponent.archives.length],
            gameAction: [
                ability.actions.discard(context => ({
                    target: context.player.opponent.archives
                })),
                ability.actions.gainAmber(context => ({
                    amount: context.player.opponent.archives.length
                }))
            ]
        });
    }
}

Dysania.id = 'dysania'; // This is a guess at what the id might be - please check it!!!

module.exports = Dysania;
