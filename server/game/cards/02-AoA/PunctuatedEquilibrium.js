const Card = require('../../Card.js');

class PunctuatedEquilibrium extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                "discard {1} from {2}'s hand and discard {3} from {4}'s hand, then make both players refill their hands",
            effectArgs: (context) => [
                context.player.hand,
                context.player,
                context.player.opponent.hand,
                context.player.opponent
            ],
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
