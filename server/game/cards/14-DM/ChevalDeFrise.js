const Card = require('../../Card.js');

class ChevalDeFrise extends Card {
    // Enhance shadows shadows.
    // Each friendly Shadows creature gains hazardous 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.type === 'creature' &&
                card.controller === context.source.controller &&
                card.hasHouse('shadows'),
            effect: ability.effects.addKeyword({ hazardous: 2 })
        });
    }
}

ChevalDeFrise.id = 'cheval-de-frise';

module.exports = ChevalDeFrise;
