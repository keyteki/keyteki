const Card = require('../../Card.js');

class Submersible extends Card {
    //While the tide is high, each friendly Thief creature gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isTideHigh(),
            match: (card) => card.hasTrait('thief'),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

Submersible.id = 'submersible';

module.exports = Submersible;
