const DrawCard = require('../../../drawcard.js');

class PalaceSpearman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.phase !== 'setup' && this.controller.phase !== 'plot' && !this.controller.firstPlayer,
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

PalaceSpearman.code = '01114';

module.exports = PalaceSpearman;
