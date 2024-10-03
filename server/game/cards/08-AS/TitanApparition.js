const Card = require('../../Card.js');

class TitanApparition extends Card {
    // Destroyed: If it is not your turn, your opponent discards 5
    // cards from the top of their deck. Otherwise, discard 5 cards
    // from the top of your deck.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.source.controller !== context.game.activePlayer &&
                    context.player.opponent
                        ? context.player.opponent.deck.slice(0, 5)
                        : context.player.deck.slice(0, 5)
            }))
        });
    }
}

TitanApparition.id = 'titan-apparition';

module.exports = TitanApparition;
