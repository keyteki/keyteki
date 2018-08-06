const ProvinceCard = require('../../provincecard.js');

class MassingAtTwilight extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isConflictProvince(),
            effect: ability.effects.changeConflictSkillFunction(card => card.getMilitarySkill() + card.getPoliticalSkill())
        });
    }
}

MassingAtTwilight.id = 'massing-at-twilight';

module.exports = MassingAtTwilight;
