const Card = require('../../Card.js');

class Lamindra extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

Lamindra.id = 'lamindra';

module.exports = Lamindra;
