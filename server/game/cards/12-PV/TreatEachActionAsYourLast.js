const Card = require('../../Card.js');

class TreatEachActionAsYourLast extends Card {
    // During your opponent's turn, after your opponent plays their second action that turn, fulfill Treat Each Action as Your Last
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onCardPlayed: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.card.type === 'action' &&
                    context.game.cardsPlayedThisPhase.filter((card) => card.type === 'action')
                        .length >= 2
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

TreatEachActionAsYourLast.id = 'treat-each-action-as-your-last';

module.exports = TreatEachActionAsYourLast;
