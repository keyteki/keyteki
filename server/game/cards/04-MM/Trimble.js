const Card = require('../../Card.js');

class Trimble extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.hasTrait('mutant'),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

Trimble.id = 'trimble';

module.exports = Trimble;
