const Card = require('../../Card.js');

class Chronophage extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            targetController: 'oppnent',
            match: (card) => card.type === 'creature' || card.type === 'artifact',
            effect: ability.effects.addKeyword({ omega: 1 })
        });
    }
}

Chronophage.id = 'chronophage';

module.exports = Chronophage;
