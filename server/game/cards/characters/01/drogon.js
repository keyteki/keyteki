const DrawCard = require('../../../drawcard.js');

class Drogon extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: dsl.effects.addKeyword('Renown')
        });
    }
}

Drogon.code = '01161';

module.exports = Drogon;
