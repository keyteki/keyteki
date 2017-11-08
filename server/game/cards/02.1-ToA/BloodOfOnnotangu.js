const ProvinceCard = require('../../provincecard.js');

class BloodOfOnnotangu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            condition: () => !this.isBroken && this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            effect: ability.effects.playerCannotSpendFate()
        });
    }
}

BloodOfOnnotangu.id = 'blood-of-onnotangu';

module.exports = BloodOfOnnotangu;