const Card = require('../../Card.js');

class Mastermindy extends Card {
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
