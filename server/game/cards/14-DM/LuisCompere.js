const Card = require('../../Card.js');

class LuisCompere extends Card {
    // Elusive.
    // At the end of your opponent's turn, if they drew 2 or more cards
    // during their "draw cards" step, steal 2.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDrawCards: (event, context) =>
                    event.player === context.source.controller.opponent &&
                    context.game.activePlayer === context.source.controller.opponent &&
                    context.game.currentPhase === 'draw' &&
                    event.amount >= 2
            },
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

LuisCompere.id = 'luis-compere';

module.exports = LuisCompere;
