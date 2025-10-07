import Card from '../../Card.js';

class CH337A extends Card {
    // Elusive.
    // (T) While the tide is high, each of CH-337A's neighbors gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isTideHigh(),
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

CH337A.id = 'ch-337a';

export default CH337A;
