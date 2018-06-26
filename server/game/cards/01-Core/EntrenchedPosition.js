const ProvinceCard = require('../../provincecard.js');

class EntrenchedPosition extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.isDuringConflict('military'),
            effect: ability.effects.modifyProvinceStrength(5)
        });
    }
}

EntrenchedPosition.id = 'entrenched-position';

module.exports = EntrenchedPosition;
