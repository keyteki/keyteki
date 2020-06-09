const Card = require('../../Card.js');

class Brabble extends Card {
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
