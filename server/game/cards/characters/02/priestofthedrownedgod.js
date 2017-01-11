const DrawCard = require('../../../drawcard.js');

class PriestOfTheDrownedGod extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.hasTrait('Drowned God'),
            effect: dsl.effects.modifyStrength(1)
        });
    }
}

PriestOfTheDrownedGod.code = '02072';

module.exports = PriestOfTheDrownedGod;
