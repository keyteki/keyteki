const DrawCard = require('../../drawcard.js');

class MotoYouth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('military') &&
                             this.game.completedConflicts.every(conflict => conflict.declaredType !== 'military' && !conflict.typeSwitched),
            match: this,
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}

MotoYouth.id = 'moto-youth';

module.exports = MotoYouth;
