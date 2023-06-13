const Card = require('../../Card.js');

class TheShadowsmith extends Card {
    // Each Mutant creature gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.hasTrait('mutant'),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

TheShadowsmith.id = 'the-shadowsmith';

module.exports = TheShadowsmith;
