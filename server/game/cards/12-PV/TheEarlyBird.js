const Card = require('../../Card.js');

class TheEarlyBird extends Card {
    // At the end of your opponent's turn, if they have more A in their pool than you, fulfill The Early Bird.
    setupCardAbilities(ability) {
        this.prophecyInterrupt({
            when: {
                onTurnEnd: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    context.game.activePlayer.amber > context.source.controller.amber
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

TheEarlyBird.id = 'the-early-bird';

module.exports = TheEarlyBird;
