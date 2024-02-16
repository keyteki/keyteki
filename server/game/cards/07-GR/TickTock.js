const Card = require('../../Card.js');

class TickTock extends Card {
    // At the end of your turn, put a time counter on each friendly
    // Clock creature. If there are 3 or more time counters on
    // Tick-Tock, destroy Tick-Tock. If you do, archive up to 3 cards
    // from your hand and discard pile.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addTimeCounter((context) => ({
                target: context.source.controller.creaturesInPlay.filter((c) => c.hasTrait('clock'))
            })),
            then: {
                condition: (context) => context.source.tokens['time'] >= 3,
                gameAction: ability.actions.destroy((context) => ({
                    target: context.source
                })),
                then: {
                    target: {
                        mode: 'upTo',
                        numCards: 3,
                        controller: 'self',
                        location: ['discard', 'hand'],
                        gameAction: ability.actions.archive()
                    }
                }
            }
        });
    }
}

TickTock.id = 'tick-tock';

module.exports = TickTock;
