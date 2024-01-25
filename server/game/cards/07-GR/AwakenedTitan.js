const Card = require('../../Card.js');

class AwakenedTitan extends Card {
    // Awakened Titan cannot ready unless you are haunted.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.controller.isHaunted(),
            effect: ability.effects.cardCannot('ready')
        });
    }
}

AwakenedTitan.id = 'awakened-titan';

module.exports = AwakenedTitan;
