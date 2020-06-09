const Card = require('../../Card.js');

class Narp extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Narp.id = 'narp';

module.exports = Narp;
