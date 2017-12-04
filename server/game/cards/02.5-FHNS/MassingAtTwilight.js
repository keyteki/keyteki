const ProvinceCard = require('../../provincecard.js');

class MassingAtTwilight extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            targetLocation: 'province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            effect: ability.effects.changeConflictSkillFunction(card => card.getMilitarySkill() + card.getPoliticalSkill())
        });
    }
}

MassingAtTwilight.id = 'massing-at-twilight';

module.exports = MassingAtTwilight;
