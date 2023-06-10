const Card = require('../../Card.js');

class Tocsin extends Card {
    // Reap: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

Tocsin.id = 'tocsin';

module.exports = Tocsin;
