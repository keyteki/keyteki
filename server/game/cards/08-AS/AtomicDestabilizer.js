const Card = require('../../Card.js');

class AtomicDestabilizer extends Card {
    // This creature gains, “At the end of your turn, this creature
    // captures 1A. Lose 1A for each A on this creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('interrupt', {
                when: {
                    onRoundEnded: (_, context) => context.player === this.game.activePlayer
                },
                gameAction: ability.actions.capture({
                    amount: 1
                }),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.loseAmber((context) => ({
                        target: context.source.controller,
                        amount: context.source.amber
                    })),
                    message: '{0} uses {1} to lose {3} amber',
                    messageArgs: (context) => [context.source.amber]
                }
            })
        });
    }
}

AtomicDestabilizer.id = 'atomic-destabilizer';

module.exports = AtomicDestabilizer;
