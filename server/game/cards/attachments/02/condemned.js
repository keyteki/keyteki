const DrawCard = require('../../../drawcard.js');

class Condemned extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.removeIcon('power')
        });
    }
}

Condemned.code = '02077';

module.exports = Condemned;
