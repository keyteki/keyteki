const Card = require('../../Card.js');

class FlameWreathed extends Card {
    // This creature gets +2 power and gains hazardous 2. (Before this creature is attacked, deal 2<D> to the attacking enemy.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyPower(2), ability.effects.addKeyword({ hazardous: 2 })]
        });
    }
}

FlameWreathed.id = 'flame-wreathed';

module.exports = FlameWreathed;
