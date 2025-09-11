const Card = require('../../Card.js');

class HoloCamo extends Card {
    // While this creature is ready, it cannot be dealt damage.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => !context.source.parent.exhausted,
            effect: ability.effects.cardCannot('damage')
        });
    }
}

HoloCamo.id = 'holo-camo';

module.exports = HoloCamo;
