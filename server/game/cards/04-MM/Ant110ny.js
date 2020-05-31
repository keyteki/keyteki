const Card = require('../../Card.js');

class Ant110ny extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent.amber
            }))
        });
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
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
