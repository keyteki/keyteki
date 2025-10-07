import Card from '../../Card.js';

class Chronometer extends Card {
    // At the end of your turn, put a time counter on each friendly Clock
    // creature. If there are 6 or more time counters on Chronometer,
    // destroy Chronometer. If you do, purge a card from a discard pile.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addTimeCounter((context) => ({
                target: context.source.controller.creaturesInPlay.filter((c) => c.hasTrait('clock'))
            })),
            then: {
                condition: (context) => context.source.tokens['time'] >= 6,
                gameAction: ability.actions.destroy((context) => ({
                    target: context.source
                })),
                then: {
                    target: {
                        controller: 'any',
                        location: 'discard',
                        gameAction: ability.actions.purge()
                    },
                    message: '{0} uses {1} to purge {2}',
                    messageArgs: (context) => [context.target]
                }
            }
        });
    }
}

Chronometer.id = 'chronometer';

export default Chronometer;
