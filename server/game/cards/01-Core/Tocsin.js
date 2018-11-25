const Card = require('../../Card.js');

class Tocsin extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

Tocsin.id = 'tocsin'; // This is a guess at what the id might be - please check it!!!

module.exports = Tocsin;
