const DrawCard = require('../../../drawcard.js');

class Helya extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: card => card.getType() === 'attachment',
            effect: ability.effects.addKeyword('Terminal')
        });
    }
}

Helya.code = '04091';

module.exports = Helya;
