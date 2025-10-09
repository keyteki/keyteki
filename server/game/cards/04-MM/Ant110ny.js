const Card = require('../../Card.js');

class Ant110ny extends Card {
    // Play: Capture all of your opponents A.
    // At the end of your turn, move 1A from ANT1-10NY to your opponents pool.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent ? context.player.opponent.amber : 0
            }))
        });
        this.interrupt({
            when: {
                onRoundEnded: (_event, context) => context.player === context.game.activePlayer
            },
            condition: (context) => context.source.hasToken('amber'),
            gameAction: [
                ability.actions.removeAmber({ amount: 1 }),
                ability.actions.gainAmber((context) => ({
                    target: context.game.activePlayer.opponent
                }))
            ]
        });
    }
}

Ant110ny.id = 'ant1-10ny';

module.exports = Ant110ny;
