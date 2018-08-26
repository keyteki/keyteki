const Card = require('../../Card.js');

class Dysania extends Card {
    setupCardAbilities(ability) {
        this.play({
            conditon: context => !!context.player.opponent,
            effect: 'discard all cards in {1}\'s archives, and draw that many cards',
            effectArgs: context => context.player.opponent,
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
