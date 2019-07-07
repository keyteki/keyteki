const Card = require('../../Card.js');

class Tocsin extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

Tocsin.id = 'tocsin';

module.exports = Tocsin;
