const DrawCard = require('../../drawcard.js');

class DoomedShugenja extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            effect: ability.effects.playerCannotPlaceFate(context => context && context.source === this)
        });
    }
}

DoomedShugenja.id = 'doomed-shugenja';

module.exports = DoomedShugenja;
