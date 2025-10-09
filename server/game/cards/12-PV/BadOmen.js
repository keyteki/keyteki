const Card = require('../../Card.js');

class BadOmen extends Card {
    // At the end of your opponent's turn, if they have exactly 6A, fulfill Bad Omen.
    setupCardAbilities(ability) {
        this.prophecyInterrupt({
            when: {
                onTurnEnded: (_, context) =>
                    this.game.activePlayer === context.source.controller.opponent &&
                    this.game.activePlayer.amber === 6
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

BadOmen.id = 'bad-omen';

module.exports = BadOmen;
