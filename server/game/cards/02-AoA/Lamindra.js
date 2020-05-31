const Card = require('../../Card.js');

class Lamindra extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

Lamindra.id = 'lamindra';

module.exports = Lamindra;
