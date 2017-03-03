const DrawCard = require('../../../drawcard.js');

class SilentSisters extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.controller.deadPile.size())
        });
    }
}

SilentSisters.code = '04097';

module.exports = SilentSisters;
