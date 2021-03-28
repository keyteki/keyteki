const Card = require('../../Card.js');

class PunctuatedEquilibrium extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                "discard all cards from both players' hands and refill them as if it were the end of the turn",
            gameAction: [
                ability.actions.discard((context) => ({
                    target: context.player.hand
                })),
                ability.actions.discard((context) => ({
                    target: context.player.opponent.hand
                }))
            ],
            then: {
                gameAction: [
                    ability.actions.draw((context) => ({
                        target: context.player,
                        refill: true
                    })),
                    ability.actions.draw((context) => ({
                        target: context.player.opponent,
                        refill: true
                    }))
                ]
            }
        });
    }
}

PunctuatedEquilibrium.id = 'punctuated-equilibrium';

module.exports = PunctuatedEquilibrium;
