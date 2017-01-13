const DrawCard = require('../../../drawcard.js');

class Imprisoned extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.removeIcon('military')
        });
    }
}

Imprisoned.code = '02116';

module.exports = Imprisoned;
