const Card = require('../../Card.js');

class PunctuatedEquilibrium extends Card {
    // Play: Each player discards their hand, then refills their hand as if it were the end of their turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                "discard {1} from {2}'s hand and discard {3} from {4}'s hand, then make both players refill their hands",
            effectArgs: (context) => [
                context.player.hand.length > 0 ? context.player.hand : 'nothing',
                context.player,
                context.player.opponent.hand.length > 0 ? context.player.opponent.hand : 'nothing',
                context.player.opponent
            ],
            gameAction: ability.actions.discardEntireLocation((context) => ({
                location: 'hand',
                target: [context.player, context.player.opponent]
            })),
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
