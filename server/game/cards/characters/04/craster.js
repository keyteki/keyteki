const DrawCard = require('../../../drawcard.js');

class Craster extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(card => card.hasTrait('Omen'))
        });
        // TODO: Sacrifice to put characters killed this phase back into play.
    }
}

Craster.code = '04085';

module.exports = Craster;
