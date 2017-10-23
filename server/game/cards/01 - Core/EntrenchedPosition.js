const ProvinceCard = require('../../provincecard.js');

class EntrenchedPosition extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            targetLocation: 'province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            effect: ability.effects.modifyProvinceStrength(5)
        });
    }
}

EntrenchedPosition.id = 'entrenched-position';

module.exports = EntrenchedPosition;
