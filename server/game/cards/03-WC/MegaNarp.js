const Card = require('../../Card.js');

class MegaNarp extends Card {
    // Mega Narps neighbors cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.cardCannot('reap')
        });
    }
}

MegaNarp.id = 'mega-narp';

module.exports = MegaNarp;
