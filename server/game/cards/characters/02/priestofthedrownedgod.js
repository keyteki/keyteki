const DrawCard = require('../../../drawcard.js');

class PriestOfTheDrownedGod extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.hasTrait('Drowned God'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

PriestOfTheDrownedGod.code = '02072';

module.exports = PriestOfTheDrownedGod;
