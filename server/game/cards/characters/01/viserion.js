const DrawCard = require('../../../drawcard.js');

class Viserion extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: dsl.effects.addKeyword('Stealth')
        });
    }
}

Viserion.code = '01166';

module.exports = Viserion;
