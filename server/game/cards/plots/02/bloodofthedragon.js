const PlotCard = require('../../../plotcard.js');

class BloodOfTheDragon extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && !card.hasTrait('Dragon'),
            targetController: 'any',
            effect: [
                ability.effects.modifyStrength(-1),
                ability.effects.killByStrength
            ]
        });
    }
}

BloodOfTheDragon.code = '02075';

module.exports = BloodOfTheDragon;
