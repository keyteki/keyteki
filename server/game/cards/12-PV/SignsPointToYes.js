const Card = require('../../Card.js');

class SignsPointToYes extends Card {
    // At the end of your opponent's turn, if they have A in their pool equal to or greater than the current key cost, fulfill Signs Point To Yes.
    setupCardAbilities(ability) {
        this.prophecyInterrupt({
            when: {
                onTurnEnd: (_, context) =>
                    this.game.activePlayer === context.source.controller.opponent &&
                    this.game.activePlayer.amber >= this.game.activePlayer.getCurrentKeyCost()
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

SignsPointToYes.id = 'signs-point-to-yes';

module.exports = SignsPointToYes;
