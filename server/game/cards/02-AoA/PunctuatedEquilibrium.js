const Card = require('../../Card.js');

class PunctuatedEquilibrium extends Card {
    // Play: Each player discards their hand, then refills their hand as if it were the end of their turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'make each player discard their hand and then refill their hands',
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
