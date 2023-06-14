const Card = require('../../Card.js');

class Zenzizenzizenzic extends Card {
    // While Zenzizenzizenzic is in the center of your battleline, refill your hand to 2 additional cards during your "draw cards" step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            effect: ability.effects.modifyHandSize(2)
        });
    }
}

Zenzizenzizenzic.id = 'zenzizenzizenzic';

module.exports = Zenzizenzizenzic;
