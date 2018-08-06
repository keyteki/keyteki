const ProvinceCard = require('../../provincecard.js');

class SanpukuSeido extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isConflictProvince(),
            effect: ability.effects.changeConflictSkillFunction(card => card.getGlory())
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

SanpukuSeido.id = 'sanpuku-seido';

module.exports = SanpukuSeido;
