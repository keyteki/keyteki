const DrawCard = require('../../../drawcard.js');

class NobleLineage extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.addIcon('power')
        });
    }
}

NobleLineage.code = '01036';

module.exports = NobleLineage;
