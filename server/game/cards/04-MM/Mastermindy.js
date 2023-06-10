const Card = require('../../Card.js');

class Mastermindy extends Card {
    // Elusive.
    // At the end of your turn, put a scheme counter on Mastermindy.
    // Action: Remove each scheme counter from Mastermindy. Steal 1 for each scheme counter removed this way.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addSchemeCounter()
        });

        this.action({
            gameAction: ability.actions.removeSchemeCounter({ all: true }),
            then: {
                gameAction: ability.actions.steal((context) => ({
                    amount: context.preThenEvent.amount
                }))
            }
        });
    }
}

Mastermindy.id = 'mastermindy';

module.exports = Mastermindy;
