const DrawCard = require('../../../drawcard.js');

class Winterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getFaction() === this.getFaction() && card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });
        // TODO: Reaction for preventing card abilities.
    }
}

Winterfell.code = '03017';

module.exports = Winterfell;
