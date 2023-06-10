const Card = require('../../Card.js');

class RingOfInvisibility extends Card {
    // This creature gains elusive and skirmish.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ elusive: 1, skirmish: 1 })
        });
    }
}

RingOfInvisibility.id = 'ring-of-invisibility';

module.exports = RingOfInvisibility;
