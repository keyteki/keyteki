const Card = require('../../Card.js');

class AncestralTimekeeper extends Card {
    // At the end of your turn, put a time counter on each friendly
    // Clock creature. If there are 12 or more time counters on
    // Ancestral Timekeeper, purge Ancestral Timekeeper. If you do,
    // take another turn after this one.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addTimeCounter((context) => ({
                target: context.source.controller.creaturesInPlay.filter((c) => c.hasTrait('clock'))
            })),
            then: {
                condition: (context) => context.source.tokens['time'] >= 12,
                gameAction: ability.actions.purge((context) => ({
                    target: context.source
                })),
                then: {
                    message: '{0} uses {1} to take another turn after this one',
                    gameAction: ability.actions.untilPlayerTurnEnd({
                        effect: ability.effects.anotherTurn()
                    })
                }
            }
        });
    }
}

AncestralTimekeeper.id = 'ancestral-timekeeper';

module.exports = AncestralTimekeeper;
