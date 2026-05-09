const Card = require('../../Card.js');

class GrammyTaps extends Card {
    // Elusive. Entrench.
    // While Grammy Taps is exhausted, each of its neighbors gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

GrammyTaps.id = 'grammy-taps';

module.exports = GrammyTaps;
