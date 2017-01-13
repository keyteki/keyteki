const DrawCard = require('../../../drawcard.js');

class SyriosTraining extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('military')
        });
    }
}

SyriosTraining.code = '01037';

module.exports = SyriosTraining;
