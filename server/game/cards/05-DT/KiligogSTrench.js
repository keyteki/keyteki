const Card = require('../../Card.js');

class KiligogSTrench extends Card {
    // At the end of your turn, place 1 depth counter on Kiligog’s Trench, then destroy each creature with power equal to the number of depth counters on Kiligog’s Trench.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addDepthCounter((context) => ({
                target: context.source
            })),
            then: {
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.power === context.source.tokens.depth
                    )
                }))
            }
        });
    }
}

KiligogSTrench.id = 'kiligog-s-trench';

module.exports = KiligogSTrench;
