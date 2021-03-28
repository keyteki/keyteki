const Card = require('../../Card.js');

class MegaNarp extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.cardCannot('reap')
        });
    }
}

MegaNarp.id = 'mega-narp';

module.exports = MegaNarp;
