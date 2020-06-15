const Card = require('../../Card.js');

class LadyLoreena extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card !== context.source &&
                context.source.neighbors.some((neighbor) => neighbor.neighbors.includes(card)),
            effect: ability.effects.addKeyword({ taunt: 1 })
        });
    }
}

LadyLoreena.id = 'lady-loreena';

module.exports = LadyLoreena;
