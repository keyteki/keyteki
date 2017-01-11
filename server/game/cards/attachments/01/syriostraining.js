const DrawCard = require('../../../drawcard.js');

class SyriosTraining extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.addIcon('military')
        });
    }
}

SyriosTraining.code = '01037';

module.exports = SyriosTraining;
