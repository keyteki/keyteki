const DrawCard = require('../../../drawcard.js');

class DevotedBloodrider extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Bloodrider'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

DevotedBloodrider.code = '04053';

module.exports = DevotedBloodrider;
