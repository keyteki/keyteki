const DrawCard = require('../../../drawcard.js');

class MilkOfThePoppy extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.blank
        });
    }
}

MilkOfThePoppy.code = '01035';

module.exports = MilkOfThePoppy;
