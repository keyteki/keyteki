const Card = require('../../Card.js');

class TheSecondMouse extends Card {
    // At the end of your opponent's turn, if they have less  in their pool than you, fulfill The Second Mouse.
    setupCardAbilities(ability) {
        this.prophecyInterrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    context.game.activePlayer.amber < context.source.controller.amber
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

TheSecondMouse.id = 'the-second-mouse';

module.exports = TheSecondMouse;
