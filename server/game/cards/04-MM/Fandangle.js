const Card = require('../../Card.js');

class Fandangle extends Card {
    // While you have 4A or more, your non-Untamed creatures enter play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) =>
                !context.source.hasHouse('untamed') && context.source.controller.amber >= 4,
            effect: ability.effects.entersPlayReady()
        });

        this.persistentEffect({
            targetLocation: 'any',
            condition: (context) => context.source.controller.amber >= 4,
            match: (card) => card.type === 'creature' && !card.hasHouse('untamed'),
            effect: ability.effects.entersPlayReady()
        });
    }
}

Fandangle.id = 'fandangle';

module.exports = Fandangle;
