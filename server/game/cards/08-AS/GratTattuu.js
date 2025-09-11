const Card = require('../../Card.js');

class GratTattuu extends Card {
    // Each other friendly Brobnar creature gets +2 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card !== context.source && card.type === 'creature' && card.hasHouse('brobnar'),
            effect: ability.effects.modifyPower(2)
        });
    }
}

GratTattuu.id = 'grat-tattuu';

module.exports = GratTattuu;
