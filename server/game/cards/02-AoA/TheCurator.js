const Card = require('../../Card.js');

class TheCurator extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            match: (card) => card.type === 'artifact',
            effect: ability.effects.entersPlayReady()
        });
    }
}

TheCurator.id = 'the-curator';

module.exports = TheCurator;
