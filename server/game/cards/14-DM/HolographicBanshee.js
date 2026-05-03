const Card = require('../../Card.js');

class HolographicBanshee extends Card {
    // Each friendly Geistoid creature gains versatile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.type === 'creature' &&
                card.controller === context.source.controller &&
                card.hasHouse('geistoid'),
            effect: ability.effects.addKeyword({ versatile: 1 })
        });
    }
}

HolographicBanshee.id = 'holographic-banshee';

module.exports = HolographicBanshee;
