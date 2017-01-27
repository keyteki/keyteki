const DrawCard = require('../../../drawcard.js');

class Viserion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Stealth')
        });
    }
}

Viserion.code = '01166';

module.exports = Viserion;
