const Card = require('../../Card.js');

class Narp extends Card {
    // Narps neighbors cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Narp.id = 'narp';

module.exports = Narp;
