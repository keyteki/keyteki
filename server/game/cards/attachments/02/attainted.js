const DrawCard = require('../../../drawcard.js');

class Attainted extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.removeIcon('intrigue')
        });
    }
}

Attainted.code = '02055';

module.exports = Attainted;
