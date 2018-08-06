const DrawCard = require('../../drawcard.js');

class MotoYouth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('military') && this.game.conflictRecord.every(conflict => (
                conflict.declaredType !== 'military' && !conflict.typeSwitched || !conflict.completed
            )),
            match: this,
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}

MotoYouth.id = 'moto-youth';

module.exports = MotoYouth;
