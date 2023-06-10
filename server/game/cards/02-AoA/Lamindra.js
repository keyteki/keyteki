const Card = require('../../Card.js');

class Lamindra extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Lamindras neighbors gain elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

Lamindra.id = 'lamindra';

module.exports = Lamindra;
