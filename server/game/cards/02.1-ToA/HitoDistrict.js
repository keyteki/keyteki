const DrawCard = require('../../drawcard.js');

class HitoDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetLocation: 'province',
            match: card => card.isProvince && card.location === this.location && card.controller === this.controller,
            effect: ability.effects.cardCannotInitiateConflict(() => this.game.currentConflict.conflictType === 'political')
        });
    }
}

HitoDistrict.id = 'hito-district';

module.exports = HitoDistrict;
