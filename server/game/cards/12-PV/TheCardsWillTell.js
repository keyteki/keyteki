const Card = require('../../Card.js');

class TheCardsWillTell extends Card {
    // During your opponent's turn, after your opponent draws a card outside of their "draw cards step", fulfill The Cards Will Tell.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onDrawCards: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.player === context.source.controller.opponent &&
                    context.game.currentPhase !== 'draw'
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

TheCardsWillTell.id = 'the-cards-will-tell';

module.exports = TheCardsWillTell;
