const DrawCard = require('../../../drawcard.js');

class NobleLineage extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('power')
        });
    }
}

NobleLineage.code = '01036';

module.exports = NobleLineage;
