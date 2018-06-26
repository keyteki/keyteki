const DrawCard = require('../../drawcard.js');

class HitoDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'province',
            match: card => card.isProvince && card.location === this.location,
            effect: ability.effects.cardCannot('initiateConflict', () => this.game.isDuringConflict('political'))
        });
    }
}

HitoDistrict.id = 'hito-district';

module.exports = HitoDistrict;
