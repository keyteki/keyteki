const DrawCard = require('../../../drawcard.js');

class MilkOfThePoppy extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank
        });
    }
}

MilkOfThePoppy.code = '01035';

module.exports = MilkOfThePoppy;
