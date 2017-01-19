const DrawCard = require('../../../drawcard.js');

class TywinLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.controller.gold)
        });
        this.plotModifiers({
            gold: 2
        });
    }
}

TywinLannister.code = '01090';

module.exports = TywinLannister;
