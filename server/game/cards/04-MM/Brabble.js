const Card = require('../../Card.js');

class Brabble extends Card {
    // Destroyed: Your opponent loses 1A. If it is not your turn, your opponent loses 3A instead.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.source.controller === context.game.activePlayer ? 1 : 3
            }))
        });
    }
}

Brabble.id = 'brabble';

module.exports = Brabble;
