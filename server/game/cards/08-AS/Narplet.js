const Card = require('../../Card.js');

class Narplet extends Card {
    // Narplet’s neighbors gain versatile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ versatile: 1 })
        });
    }
}

Narplet.id = 'narplet';

module.exports = Narplet;
