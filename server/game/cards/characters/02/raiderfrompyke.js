const DrawCard = require('../../../drawcard.js');

class RaiderFromPyke extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: card => card.hasTrait('Weapon'),
            effect: ability.effects.gainAmbush()
        });
    }
}

RaiderFromPyke.code = '02091';

module.exports = RaiderFromPyke;
