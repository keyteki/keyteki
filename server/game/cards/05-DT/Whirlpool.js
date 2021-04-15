const Card = require('../../Card.js');

class Whirlpool extends Card {
    // At the end of each player's turn, that player gives control of the creature on their right flank to their opponent and moves it to that player's left flank.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => !!context.game.activePlayer.opponent
            },
            gameAction: [
                ability.actions.cardLastingEffect((context) => ({
                    target: context.game.activePlayer.creaturesInPlay.slice(
                        -Math.min(context.game.activePlayer.creaturesInPlay.length, 1)
                    ),
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.game.activePlayer.opponent)
                })),
                ability.actions.cardLastingEffect((context) => ({
                    target: context.game.activePlayer.creaturesInPlay.slice(
                        -Math.min(context.game.activePlayer.creaturesInPlay.length, 1)
                    ),
                    effect: ability.effects.takeControlOnLeft()
                }))
            ]
        });
    }
}

Whirlpool.id = 'whirlpool';

module.exports = Whirlpool;
