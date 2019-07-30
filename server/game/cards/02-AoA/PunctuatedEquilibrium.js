const Card = require('../../Card.js');

class PunctuatedEquilibrium extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'discard all cards from both players\' hands and refill them as if it were the end of the turn',
            gameAction: [
                ability.actions.discard(context => ({
                    target: context.player.hand
                })),
                ability.actions.draw(context => ({ amount: context.player.maxHandSize })),
                ability.actions.discard(context => ({
                    target: context.player.opponent.hand
                })),
                ability.actions.draw(context => ({
                    target: context.player.opponent,
                    amount: context.player.opponent.maxHandSize
                }))
            ]
        });
    }
}

PunctuatedEquilibrium.id = 'punctuated-equilibrium';

module.exports = PunctuatedEquilibrium;
