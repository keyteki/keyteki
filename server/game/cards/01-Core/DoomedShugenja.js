const DrawCard = require('../../drawcard.js');

class DoomedShugenja extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacter',
                restricts: 'source',
                source: this
            })
        });
    }
}

DoomedShugenja.id = 'doomed-shugenja';

module.exports = DoomedShugenja;
