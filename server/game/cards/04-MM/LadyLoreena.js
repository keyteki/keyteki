const Card = require('../../Card.js');

class LadyLoreena extends Card {
    // Taunt.
    // Lady Loreenas taunt also applies to its neighbors neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card !== context.source &&
                !card.getKeywordValue('taunt') &&
                context.source.neighbors.some((neighbor) => neighbor.neighbors.includes(card)),
            effect: ability.effects.cardCannot('attackDueToTaunt')
        });
    }
}

LadyLoreena.id = 'lady-loreena';

module.exports = LadyLoreena;
