const DrawCard = require('../../../drawcard.js');

class Knighted extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.modifyStrength(1)
        });
        this.whileAttached({
            effect: dsl.effects.addTrait('Knight')
        });
    }
}

Knighted.code = '02058';

module.exports = Knighted;
