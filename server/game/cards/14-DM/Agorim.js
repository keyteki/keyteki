const Card = require('../../Card.js');

class Agorim extends Card {
    // While Agorim is in the center of your battleline, friendly creatures get +5 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            match: (card, context) =>
                card.type === 'creature' && card.controller === context.source.controller,
            effect: ability.effects.modifyPower(5)
        });
    }
}

Agorim.id = 'agorim';

module.exports = Agorim;
