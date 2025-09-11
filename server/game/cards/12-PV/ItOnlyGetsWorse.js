const Card = require('../../Card.js');

class ItOnlyGetsWorse extends Card {
    // During your opponent's turn, after your opponent steals one or more  from you, fulfill It Only Gets Worse.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onStealAmber: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.player === context.source.controller
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

ItOnlyGetsWorse.id = 'it-only-gets-worse';

module.exports = ItOnlyGetsWorse;
