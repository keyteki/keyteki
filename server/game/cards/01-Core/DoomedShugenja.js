const DrawCard = require('../../drawcard.js');

class DoomedShugenja extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            effect: ability.effects.playerCannotPlaceFate(card => card === this)
        });
    }
}

DoomedShugenja.id = 'doomed-shugenja';

module.exports = DoomedShugenja;
